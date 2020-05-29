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
};