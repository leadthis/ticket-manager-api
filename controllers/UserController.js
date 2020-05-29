module.exports = (app) => {
    
    // [POST] => /user
    app.post("/user", async (req, res) => {
        let errors = [];
        const body = req.body;
        let obrigatorios = [ "name", "email", "password" ];

        const resp = {};
        resp.status = 0;
        resp.data = null;
        resp.errors = [];

        obrigatorios.forEach(campo => {
            req.assert(campo, `O parâmetro '${campo}' precisa ser informado!`).notEmpty();
        });

        req.assert("email", "Informe um email válido!").isEmail();

        const validators = req.validationErrors();
        errors = (validators) ? errors.concat(validators) : errors;
        
        if(errors.length > 0){
            resp.errors = errors;
            res.status(400).send(resp);
            return;
        }
        
        if(body.equipe){
            const equipe = await Usuario.Get(`token = '${body.equipe}'`);
            body.equipe = (equipe[0]) ? equipe[0].token : "";
        }
        

        const data = {
            id: Util.generateId(),
            ...body,
            password: User.HashPassword(body.password, body.email)
        };

        // --------------- Verifica se O usuário já existe
        const exists = await User.Get(`email = '${data.email}'`);
        
        if(exists.length > 0){
            
            if(exists.find(x => x.email === data.email)){
                resp.errors.push({
                    param: "email",
                    msg: "Este email já está sendo utilizado!"
                });
            }

            res.status(403).send(resp);
            return;
        }


        // --------------- Cria usuário
        const response = await User.Create(data);
        
        if(!response.status){
            resp.errors.push(response);
            res.status(500).send(resp);
            return;
        }

        resp.status = 1;
        resp.data = data.id;
        resp.msg = "Usuario cadastrado com sucesso!";
        res.status(201).send(response);

    });

    // [POST] => /user/login
    app.post("/user/login", async (req, res) => {
        let errors = [];
        const body = req.body;
        const obrigatorios = [ "email", "password" ];

        obrigatorios.forEach(campo => {
            req.assert(campo, `O parâmetro '${campo}' precisa ser informado!`).notEmpty();
        });

        req.assert("email", "Informe um email válido!").isEmail();
        
        const resp = {};
        resp.status = 0;
        resp.data = null;
        resp.errors = [];

        const validators = req.validationErrors();
        errors = (validators) ? errors.concat(validators) : errors;
        
        
        if(errors[0] != false && errors.length > 0){
            resp.errors = errors;
            res.status(400).send(resp);
            return;
        }

        let usuario = await User.Get(`email = '${body.email}'`);

        if(usuario.length == 0){
            resp.errors.push({
                param: "email",
                msg: "Email não encontrado!"
            });
    
            res.status(400).send(resp);
            return;
        }
        
        usuario = usuario.find(usuario => usuario.password == User.HashPassword(body.password, usuario.email));

        if(!usuario){
            resp.errors.push({
                param: "senha",
                msg: "A senha está incorreta!"
            });

            res.status(401).send(resp);
            return;
        }

        if(usuario.status != 1){
            resp.errors.push({
                local: "status",
                msg: "Esta conta está " + ((usuario.status == 2) ? "bloqueada!" :( (usuario.status == 3) ? "Aguardando Aprovação" : "Inativa!"))
            });
            res.status(401).send(resp);
            return;
        }

        const data = { 
            id: Util.generateId(),
            user: usuario.id,
            last_date: (new Date() / 1000 | 0)
        };

        const result = await Session.Create(data);

        if(result.status !== 1){
            resp.errors.push({
                location: "login",
                msg: "Erro ao realizar Login"
            });
            res.status(500).send(resp);
            return;
        }

        resp.msg = "Bem Vindo!";
        resp.data = {
            session_id: data.id,
            date: data.last_date,
        };
        resp.status = 1;

        res.send(resp);
    });
};