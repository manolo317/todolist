// server/api.js
/*
 |--------------------------------------
 | Dependencies
 |--------------------------------------
 */

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const List = require('./models/List');
const Todo = require('./models/Todo');

/*
 |--------------------------------------
 | Authentication Middleware
 |--------------------------------------
 */

module.exports = function(app, config) {
    // Authentication middleware
    const jwtCheck = jwt({
        secret: jwks.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
        }),
        aud: config.AUTH0_API_AUDIENCE,
        issuer: `https://${config.AUTH0_DOMAIN}/`,
        algorithm: 'RS256'
    });

    // Check for an authenticated admin user
    const adminCheck = (req, res, next) => {
        const roles = req.user[config.NAMESPACE] || [];
        if (roles.indexOf('admin') > -1) {
            next();
        } else {
            res.status(401).send({message: 'Not authorized for admin access'});
        }
    }

    /*
     |--------------------------------------
     | API Routes
     |--------------------------------------
     */

    const _eventListProjection = 'title datetime viewPublic';

    // GET list of public lists
    app.get('/api/lists', (req, res) => {
        List.find({viewPublic: true}, _eventListProjection, (err, lists) => {
            let listsArray = [];
            if (err) {
                return res.status(500).send({message: err.message});
            }
            if (lists) {
                lists.forEach(list => {
                    listsArray.push(list);
                });
            }
            res.send(listsArray);
        });
    });

    // GET list by list ID
    app.get('/api/list/:id', jwtCheck, (req, res) => {
        List.findById(req.params.id, (err, list) => {
            if (err) {
                return res.status(500).send({message: err.message});
            }
            if (!list) {
                return res.status(400).send({message: 'List not found.'});
            }
            res.send(list);
        });
    });

    // GET RSVPs by event ID
    app.get('/api/list/:listId/todos', jwtCheck, (req, res) => {
        Todo.find({listId: req.params.listId}, (err, todos) => {
            let todosArray = [];
            if (err) {
                return res.status(500).send({message: err.message});
            }
            if (todos) {
                todos.forEach(todo => {
                    todosArray.push(todo);
                });
            }
            res.send(todosArray);
        });
    });

    // POST a new Todo
    app.post('/api/todo/new', jwtCheck, (req, res) => {
        Todo.findOne({listId: req.body.listId, userId: req.body.userId}, (err, existingTodo) => {
            if (err) {
                return res.status(500).send({message: err.message});
            }
            if (existingTodo) {
                return res.status(409).send({message: 'You have already TODOed to this list.'});
            }
            const todo = new Todo({
                userId: req.body.userId,
                title: req.body.title,
                listId: req.body.listId,
                done: req.body.done,
                comments: req.body.comments
            });
            todo.save((err) => {
                if (err) {
                    return res.status(500).send({message: err.message});
                }
                res.send(todo);
            });
        });
    });

    // PUT (edit) an existing RSVP
    app.put('/api/todo/:id', jwtCheck, (req, res) => {
        Todo.findById(req.params.id, (err, todo) => {
            if (err) {
                return res.status(500).send({message: err.message});
            }
            if (!todo) {
                return res.status(400).send({message: 'TODO not found.'});
            }
            if (todo.userId !== req.user.sub) {
                return res.status(401).send({message: 'You cannot edit someone else\'s TODO.'});
            }
            todo.title = req.body.title;
            todo.done = req.body.done;
            todo.comments = req.body.comments;

            todo.save(err => {
                if (err) {
                    return res.status(500).send({message: err.message});
                }
                res.send(todo);
            });
        });
    });


};