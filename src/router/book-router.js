const {exec} = require('../db/mysql');

 /*sql语句区域*/
//精确获取书籍信息
const getDetailBook= (body)=>{
    let bName=body.bName;
    let sql = `select * from book where 1=1 `;
if (bName){
    sql +=`and bName='${bName}'`
}
return exec(sql)
};

 // 获取所有学生列表
const getStudentList = () =>{
    let sql = `select * from student where 1=1 `;
    // if (author){
    //     sql +=`and author='${author}'`
    // }
    return exec(sql)
};

// 获取所有书籍列表
const getAllBook = ()=>{
    let sql =`select * from book where 1=1 `;
    return exec(sql)
};

// 模糊查询书籍信息
const getIndistinctBook= (body)=>{
    let bName=body.bName;
    let sql="select * from book where 1=1 ";
    if (body.bName){
        sql +=`and  bName LIKE '%${bName}%'`
    }
    return exec(sql)
};

// 修改书籍信息
const updateBook= (body)=>{
    let id = body.id||"";
    let bName = body.bName||"";
    let author=body.author ||"";
    let store =body.store||"";

    let sql=`update book set bname='${bName}',author='${author}',store='${store}'  where id='${id}' `;
    // sql +=`id=${id}`;
    if (body.upTime) {
        sql +=`,upTime='${body.upTime}'`
    }
    return exec(sql)
};

// 添加书籍信息
const insertBook= (body)=>{
    let bName =body.bName ||"";
    let author=body.author ||"";
    let store =body.store||"";
    const  upTime = Date.now();
    let sql = `insert into book (bname,author,store,uptime) values('${bName}','${author}','${store}',now()) `;
    return exec(sql)

};

// 删除书籍
const deleteBook= (body)=>{
    let id =body.id;
    if (id){
        let sql=`delete from book where id=${id}`;
        return exec(sql) .then(res=>{
            return {
                msg:"删除成功",
                status:true,
                res:res
            }
        })
            .catch(err=>{})
    }
    return {msg:"删除失败"}

};

const handleBookRouter = (req,res) =>{

    const method = req.method;
    const path = req.path;

    //获得所有书籍
    if (method ==="GET" && path==="/book/getAll"){
       const result=getAllBook();
        return result.then((res)=>{
            console.log(res);
            return res
        })
            .catch ((err)=>{console.log(err)})
    }
    //非精确搜索
    if (method === "POST" && path==="/book/searchIndistinct"){
       const result =getIndistinctBook(req.body);
        return result.then((res) => {
            console.log(" res", res);
            return res })
            .catch ((err)=>{console.log(err)})
    }
    //精确搜索书籍
    if (method === "POST" && path === "/book/searchDetail"){
        const result = getDetailBook(req.body)

      return  result.then(res=>{
           return res
        })
        .catch ((err)=>{console.log(err)})
    }
    //添加书籍
    if (method === "POST" && path === "/book/insertBook"){
        const result =insertBook(req.body);
        return result.then((res) => {
            console.log("添加书籍",res.insertId);
            if (res.insertId) {
                return {
                    id:res.insertId,
                    status:true,
                    msg:"书籍添加成功"
                }
            }
            return {res:res,status : false,msg:"书籍添加失败",}
        })
            .catch ((err)=>{console.log(err)})
    }
    //修改书籍
    if (method === "POST" && path === "/book/updateBook"){
        const result =updateBook(req.body);
       return result.then((res)=>{
            console.log("更新操作",res);
            return{
                msg:"书籍更新成功",
                status : res.protocol41,
                res:res
            }
        })
            .catch((err)=>{console.log(err)})
    }
    //删除书籍
    if (method === "POST" && path === "/book/delete"){
        let result=deleteBook(req.body);
        return result
    }

};

module.exports =handleBookRouter;
