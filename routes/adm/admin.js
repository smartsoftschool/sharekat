module.exports = function (app) {

    app.get("/adminlogin", app.adminauth.adminalreadylogin, function (req, res) {
        res.render("adm/admin/adminlogin", { csrfToken: req.csrfToken() })
    })

    app.post("/adminlogin", app.adminauth.adminlogin, function (req, res) {
        res.redirect('/admin');
    })

    app.get('/admin/logout', app.adminauth.adminlogout, function (req, res) {
        res.redirect('/admin');
    });

    app.get('/admin/error', function (req, res) {
        res.render("adm/error/err", { msg: app.msg.get() })
    })
    app.post('/admin/register', function (req, res) {
        var model = req.body;

        app.bcrypt.hash(model.pass, null, null, function (err, hash) {
            var entity = new app.db.Admin();
            entity.name = model.name;
            entity.pass = hash;
            entity.isAdmin = "true";

            console.log(entity);

            entity.save(function (err, result) {
                if (err) {
                    res.redirect("/")
                } else {
                    res.redirect("/admin")
                    console.log(result);
                }
            })

        })

    })

    app.get('/admin/country', app.adminauth.adminloginRequired, function (req, res) {
        app.db.Country.find({}, function (err, result) {
            if (result) {
                res.render('adm/admin/adress/country/index', { admin: req.admin, entities: result, csrfToken: req.csrfToken(), msg: app.msg.get() })
            } else {
                res.redirect("/admin");
            }
        })

    })

    app.get('/admin/country/add', app.adminauth.adminloginRequired, function (req, res) {
        res.render('adm/admin/adress/country/add', { admin: req.admin, csrfToken: req.csrfToken(), msg: req.msg })
    })
    app.post('/admin/country/add', function (req, res) {
        var model = req.body;
        var entity = new app.db.Country();
        entity.name = model.name;
        entity.save(function (err, result) {
            if (err) {
                res.redirect("/admin/country")
            } else {
                res.redirect("/admin/country")
            }
        })
    })

    app.post('/admin/country/delete/:id', function (req, res) {
        var id = req.params.id;
        app.db.State.find({ countryId: id }, function (err, entities) {
            if (err) {
                app.msg.set(err);
                res.redirect('/admin/error')
            } else {
                console.log(entities.length);
                if (entities.length) {
                    app.msg.set("عفوا لا يمكن مسح البيانات لارتباطها ببيانات فرعيه");
                    res.redirect('/admin/country');
                }
                else {
                    app.db.Country.findByIdAndRemove(id, function (err, result) {
                        if (err) { throw err }
                        else {
                            res.redirect('/admin/country');
                        }
                    })
                }
            }

        })

    })

    app.get('/admin/country/edit/:id', function (req, res) {
        var id = req.params.id;

        app.db.Country.findById(id, function (err, entity) {
            if (err) { throw err }
            else {
                res.render('adm/admin/adress/country/edit', { country: entity, csrfToken: req.csrfToken(), admin: req.admin })
            }
        })
    })

    app.post('/admin/country/edit/:id', function (req, res) {
        var id = req.params.id;
        var name = req.body.name;
        app.db.Country.update({ _id: id }, { $set: { name: name } }, function (err, entity) {
            if (err) { throw err }
            else {
                res.redirect("/admin/country")
            }
        })
    })


    app.get('/admin/state', app.adminauth.adminloginRequired, function (req, res) {
        app.db.State.find({}, function (err, result) {
            if (result) {
                res.render('adm/admin/adress/state/index', { admin: req.admin, entities: result, csrfToken: req.csrfToken(),  msg: app.msg.get() })
            } else {
                res.redirect("/admin");
            }
        })
    })
    app.get('/admin/state/add', function (req, res) {
        app.db.Country.find({}, function (err, result) {
            if (result) {
                res.render('adm/admin/adress/state/add', { admin: req.admin, entities: result, csrfToken: req.csrfToken() })
            } else {
                res.redirect("/admin");
            }
        })
    })
    app.post('/admin/state/add', function (req, res) {
        var model = req.body;
        app.db.Country.findOne({ name: model.country }, function (err, result) {
            var entity = new app.db.State();
            entity.name = model.name;
            entity.countryId = result._id;
            entity.save(function (err, result) {
                if (err) {
                    res.redirect("/admin/state");
                } else {
                    res.redirect("/admin/state");
                }
            })
        })
    })

    app.post('/admin/state/delete/:id', function (req, res) {
        var id = req.params.id;
        app.db.City.find({ stateId: id }, function (err, entities) {
            if (err) {
                app.msg.set(err);
                res.redirect('/admin/error')
            } else {
                if (entities.length) {
                    app.msg.set("عفوا لا يمكن مسح البيانات لارتباطها ببيانات فرعيه");
                    res.redirect('/admin/state');
                }
                else {
                    app.db.State.findByIdAndRemove(id, function (err, result) {
                        if (err) { throw err }
                        else {
                            res.redirect('/admin/state');
                        }
                    })
                }
            }

        })

    })
    app.get('/admin/state/edit/:id', function (req, res) {
        var id = req.params.id;

        app.db.State.findById(id, function (err, entity) {
            if (err) throw { err }
            else {
                app.db.Country.findById(entity.countryId, function (err, country) {
                    if (err) throw { err }
                    else {
                        app.db.Country.find({}, function (err, entities) {
                            res.render('adm/admin/adress/state/edit', { admin: req.admin, entities: entities, state: entity, country: country, csrfToken: req.csrfToken() })
                        })
                    }
                })
            }
        })
    })
    app.post('/admin/state/edit/:id', function (req, res) {
        var id = req.params.id;
        var model = req.body;
        if (model.country) {
            app.db.Country.findOne({ name: model.country }, function (err, result) {
                if (err) throw { err };
                app.db.State.update({ _id: id }, { $set: { name: model.name, countryId: result._id } }, function (err, entity) {
                    if (err) { throw err }
                    else {
                        res.redirect("/admin/state")
                    }
                })
            })
        } else {
            app.db.State.update({ _id: id }, { $set: { name: model.name } }, function (err, entity) {
                if (err) { throw err }
                else {
                    res.redirect("/admin/state")
                }
            })
        }

    })

    app.get('/admin/city', app.adminauth.adminloginRequired, function (req, res) {
        app.db.City.find({}, function (err, result) {
            if (err) throw { err };
            res.render('adm/admin/adress/city/index', { admin: req.admin, entities: result, csrfToken: req.csrfToken() })
        })
    })
    app.get('/admin/city/add', function (req, res) {
        app.db.State.find({}, function (err, result) {
            if (err) throw { err };
            res.render('adm/admin/adress/city/add', { admin: req.admin, entities: result, csrfToken: req.csrfToken() })
        })
    })
    app.post('/admin/city/add', function (req, res) {
        var model = req.body;
        app.db.State.findOne({ name: model.state }, function (err, result) {
            if (err) throw { err };
            var entity = new app.db.City();
            entity.name = model.name;
            entity.stateId = result._id;
            entity.save(function (err, result) {
                if (err) {
                    res.redirect("/admin/city");
                } else {
                    res.redirect("/admin/city");
                }
            })
        })
    })

    app.get('/admin/city/edit/:id', function (req, res) {
        var id = req.params.id;
        app.db.City.findById(id, function (err, entity) {
            if (err) throw { err };
            app.db.State.findById(entity.stateId, function (err, state) {
                if (err) throw { err };
                app.db.State.find({}, function (err, result) {
                    if (err) throw { err };
                    res.render('adm/admin/adress/city/edit', { admin: req.admin, city: entity, state: state, entities: result, csrfToken: req.csrfToken() });
                })
            })
        })
    })

    app.post('/admin/city/edit/:id', function (req, res) {
        var id = req.params.id;
        var model = req.body;
        if (model.state) {
            app.db.State.findOne({ name: model.state }, function (err, result) {
                if (err) { throw err }
                app.db.City.update({ _id: id }, { $set: { name: model.name, stateId: result._id } }, function (err, entity) {
                    if (err) { throw err }
                    else {
                        res.redirect("/admin/city")
                    }
                })
            })
        } else {
            app.db.City.update({ _id: id }, { $set: { name: model.name } }, function (err, entity) {
                if (err) { throw err }
                else {
                    res.redirect("/admin/city")
                }
            })
        }

    })
    app.post('/admin/city/delete/:id', function (req, res) {
        var id = req.params.id;

        app.db.City.findByIdAndRemove(id, function (err, result) {
            if (err) { throw err }
            else {
                res.redirect('/admin/city');
            }
        })
    })

    app.get('/admin/zone', app.adminauth.adminloginRequired, function (req, res) {
        app.db.Zone.find({}, function (err, result) {
            if (err) throw { err };
            res.render('adm/admin/adress/zone/index', { admin: req.admin, entities: result, csrfToken: req.csrfToken() })
        })
    })



}