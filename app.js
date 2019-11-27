const querystring = require("querystring")
const handleBookRouter=require("./src/router/book-router");
const loginRouter=require("./src/router/login-router");
const handleBookOperate=require("./src/router/operateBook-router")

//用于处理 post data
const getPostData=(req) =>{
    const promise = new Promise((resolve,reject)=>{
        let postData = "";
        req.on("data",chunk => {
            postData += chunk.toString()
        });
        req.on("end", () => {
            if (!postData){
                resolve("数据为空")
                reject("数据为空")
                return
            }

            resolve(
                JSON.parse(postData)
            )
        })
    });
    return promise
};
const serverHandle = (req,res) => {

    //设置请求头
    res.setHeader("Content-type",'application/json');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Length, Authorization, Accept, X-Requested-With');
    res.setHeader("Access-Control-Allow-Origin", "*");

    const url   =  req.url;
    req.path =url.split('?')[0];
    req.query = querystring.parse(url.split('?')[1]);

    getPostData(req)
        .then(postData=>{

            /*！！！！注意res.end有个巨大的坑 当你调用res.end有return的功能
            * 当调用时 下方的代码都不会执行
            * */

                // 这里传递过来的postData已经处理完毕
                req.body = postData;

                // 登陆、密码修改、注册接口
                const login=loginRouter(req,res);
                if (login) {
                        login.then((data)=>{
                            console.log("成功成功！");
                            console.log(data)
                            res.end(
                                JSON.stringify(data)
                            )
                        });
                }

                //获取书籍信息的接口精确查询，模糊查询
                const bookRouter=handleBookRouter(req,res);
                if (bookRouter){
                    bookRouter.then((data)=>{
                        console.log(data);
                        res.end(
                            JSON.stringify(data)
                        );
                    });
                }


                //书籍的各种操作包括外接修改接口
                const operate =handleBookOperate(req,res);
                if (operate){
                    if (operate.then){
                        operate.then(res01=>{
                            res.end(
                                JSON.stringify(res01)
                            )
                        })
                    }
                    else {
                        res.end(
                            JSON.stringify(operate)
                        )
                    }

                }

            }
        )
        .catch(error=>{
            console.log(error)
        })



    // res.writeHead(404,{"Content-type":"text/plain"})
    // res.write("404 Not Found\n");
    // res.end();

};

module.exports = serverHandle;
