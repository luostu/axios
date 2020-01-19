// 课程上使用 axios 的拦截器是在 jsbin.com 中进行的。
// 如果你在本地实验会发现拦截器不起作用，这是正常的。
// 你如果想让本地的拦截器也起作用，就需要自己写 server.js 来响应所有请求。




fakedata()



function Model(options){
  this.data=options.data
  this.resource=options.resource
  
}
Model.prototype.fetch=function(id){
   return axios.get(`/${this.resource}/${id}`).then((response)=>{
    this.data=response.data
       return response
       
  })
}
Model.prototype.update=function(id,data){
 
  return axios.put(`/${this.resource}/${id}`,data).then((response)=>{
    this.data=response.data
      
       return response 
     })
}

function View({el,template}){
  this.el=el
  this.template=template
}

 View.prototype.render=function(data){
   //由于不清楚data里面是否又name和number所以需要遍历
   let html=this.template
   for(let key in data){
     html=html.replace(`__${key}__`,data[key])
   }
    
    $(this.el).html(html)
 }
 
 //上面是MVC类，下面是MVC对象
 
 let model=new Model({
   data:{
        name:'',
        number:0,
        id:'',
      
    },
   resource:'book'
})
 
 let view=new View({
   el:'#app',
   template:
      `
    <div>
    书名：《__name__》
    数量：<span id=number>__number__</span>
    </div>
    <div>
      <button id="addOne">加1</button>
      <button id="minusOne">减1</button>
      <button id="reset">归零</button>
    </div>
 
      `
    
   
 })
  
  
  
  
 
  
  //可以不在后端返回数据，而是直接在前端写死
  
  //上面是一个假的数据库
  //{data}等同于data=response.data
 
 

  controller={
    inite(options){
     let {model,view}=options
      this.model=model//后面的model是外面的model，这样写是后面能用this.model
      this.view=view
      this.bindEvent()
      this.model.fetch(1)
 .then(({data})=>{
 this.view.render(this.model.data)
 

 })
    },
    addOne:function(){
      let oldNumBer=$('#number').text()
    let newNumBer=oldNumBer-0+1
   
   this.model.update(1,{number:newNumBer})
    .then(()=>{
       this.view.render(this.model.data)  
     
    })
    },
    minusOne:function(){
      let oldNumBer=$('#number').text()
    let newNumBer=oldNumBer-0-1
    console.log('newnumber')
    console.log(newNumBer)
    this.model.update(1,{number:newNumBer})
    .then(()=>{
        this.view.render(this.model.data)
    
    })
    },
    reset:function(){
       this.model.update(1,{number:0}).then(()=>{
        this.view.render(this.model.data)
      
    })
    },
    bindEvent:function(){
      $(this.view.el).on('click','#addOne',this.addOne.bind(this))//注意这里的addOne没有说调用
    //因为是里面的内容变过了，所以要用这这方式
  $(this.view.el).on('click','#minusOne',this.minusOne.bind(this))
  $(this.view.el).on('click','#reset',this.reset.bind(this))
    }
    
  }
 
  
  
  
 


  
 controller.inite({model:model,view:view})  


   function fakedata(){
     let book={
    name:'javascript高级教程',
      number:2,
      id:1,
  }
     axios.interceptors.response.use(function (response) {
     let {config:{url,data,method}}=response
     //这个data是请求的data
     if(url==='/book/1'&& method==='get'){
      response.data=book
     
    }else if(url==='/book/1'&& method==='put'){
      data=JSON.parse(data)
      Object.assign(book,data)
      response.data=book
     
      }
       return response;
    })
   }

