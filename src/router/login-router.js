const {exec} = require('../db/mysql');
const handleLogin=(postData)=>{
    const sNo=postData.sNo;
    const sql=`select * from student where sno=${sNo}`;
    return exec(sql);
};

const handleLoginRouter=(req,res)=>{

    const method = req.method;
    const path = req.path;
    const postData=req.body;
    //登录,成功登陆返回true和学号
    if (method==="POST" && path==="/login"){
        const password=postData.password;
        const sNo=postData.sNo;
        const result = handleLogin(postData);
       return result.then(res=>{
            // 这里加了字符串是为了防止前端传入的值是number类型
            if (res[0].password===password+"" && res[0].sno===sNo+""){
                return {
                    res:res,
                    status :true,
                    msg:"登录成功"
                };
            }
            return {
                sNo:sNo,
                res : res,
                status : false,
                msg:"密码或者用户名不正确"};
        })
            .catch (err => {console.error(err)})
    }

    //注册，错误信息仍需处理
    if (method ==="POST" && path==="/signUp"){
        const sNo=postData.sNo;
        const sName=postData.createName||"";
        const passwd=postData.createPassWord;
        const sSex=postData.createSex||null;
        const lBook=postData.lBook||null;
        if (sNo && sName && passwd) {
            const sql=`insert into student (sname,sno,ssex,lbook,password) values('${sName}','${sNo}','${sSex}','${lBook}','${passwd}')`;
           return exec(sql).then(res=>{
                console.log(res);
                return res
            })
                .catch(err=>{console.log(err)})
        }
        return {
            msg:"请将信息输入完全",
            status:false,
            //这里返回不过去 因为没有返回promise对象
        }
    }

    // 更改密码
    if (method === "POST" && path === "/passwordModify"){
        const sNo =postData.sNo+"";
        const password=postData.password+"";
        const newPassword = postData.newPassword+"";
        const sqlDataSrh=`select * from student where sno=${sNo} `;
        const sqlData=exec(sqlDataSrh);
        return sqlData.then(res=>{
            console.log("password",res[0].password);
            //当验证传输密码是否与数据库匹配
            if (password ===res[0].password && sNo===res[0].sno){
                const sqlUpdate=`update student set password='${newPassword}' where sno=${sNo}`;
                const confirm =exec(sqlUpdate);
                return confirm .then(res=>{
                    return {
                        res:res,
                        status:true,
                        msg:"密码已修改成功"
                    }
                })
                    .catch(err=>{console.log(err)})
            }
            return {
                res:res,
                status : false,
                msg:"您的原密码不正确"
            }
        }) .catch(err => {
            console.log(err)
        })
    }
};

module.exports =handleLoginRouter;
