//权限列表接口 
 export const getAuthList = (data) => http.get("/api/auth/getAuthList",data);
//测试 
 export const bar = (data) => http.post("/foo/bar",data);
