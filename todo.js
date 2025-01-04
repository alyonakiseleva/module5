
// сохранение имени пользователя

document.addEventListener ('DOMContentLoaded', ()=>{
    loadTasks(); 
    const saved_user_name=localStorage.getItem ("user_name");    
    if (saved_user_name===null) {  
        const b=document.getElementById ("button_user_name");
        b.addEventListener ("click", () => {
            const a=document.getElementById("input_user_name");            
            localStorage.setItem ("user_name", `${a.value}`)       
            const newUser=document.createElement("h2");
            newUser.innerHTML=`Здравствуйте, ${a.value}! `;
            document.body.prepend(newUser);  
            b.remove();
            a.remove();
        });          
    }
    else {    
        const newUser=document.createElement("h2");
        newUser.innerHTML=`Здравствуйте, ${saved_user_name}!`;
        document.body.prepend(newUser);  
        const b=document.querySelector ("button");  
        const a=document.querySelector("input");   
        b.remove();
        a.remove();     
    }  
         
});
 
//Функция загрузки задач
 
function loadTasks(){
    const tasks=JSON.parse(localStorage.getItem('tasks')) || []; 
    if (tasks.length===0){
        const no_tasks=document.createElement("h2");
        no_tasks.innerHTML="У вас нет задач для выполнения.";
        no_tasks.id="no_tasks_list";
        document.body.appendChild (no_tasks);       
    }
    else {
       tasks.forEach((item)=>{
            const li=document.createElement('li');                    
            const ul=document.querySelector('ul');
            if (item.status===false){
                item.status="В работе";
                li.innerHTML=`<span id="item_text" ondblclick="editTask(this)"> ${item.text}</span ><div class="StatusAndButton"><span id="status_Task" onclick="completedTask(this)">${item.status}</span><button id="deleteButton" onclick="deleteTask(this)"> Удалить </button></div> `;
            }
            else{
                item.status="Задача выполнена";
                li.innerHTML=`<span style="text-decoration:line-through" class="taskDone" id="item_text" ondblclick="editTask(this)"> ${item.text}</span ><div class="StatusAndButton"><span id="status_Task" onclick="completedTask(this)">${item.status}</span><button id="deleteButton" onclick="deleteTask(this)"> Удалить </button></div> `;         
            }
            
            ul.appendChild(li);
            li.id="taskItem";            
       });          
    }

}

//Функция добавления задачи

function AddTask(){         
    const buttonInput=document.getElementById("button__addTask");   
    const taskInput=document.getElementById ("taskInput");
    buttonInput.addEventListener("click", ()=>{
        const textTask=taskInput.value.trim();        
        if (textTask===''){
            return;
        }
        const newTask={
            text: `${textTask}`,
            status:false
        }; 
        const tasks=JSON.parse(localStorage.getItem('tasks')) ||[];
        tasks.push(newTask); 
        const li=document.createElement('li');       
        const ul=document.querySelector('ul');
        const status_Task="В работе";        
        li.innerHTML=`<span id="item_text" ondblclick="editTask(this)"> ${textTask}</span><div class="StatusAndButton"><span id="status_Task" onclick="completedTask(this)">${status_Task}</span> <button id="deleteButton" onclick="deleteTask(this)"> Удалить </button></div> `;
        ul.appendChild(li);
        li.id="taskItem";
        taskInput.value = "";
        if (tasks.length===1){
            const delete_no_task_list=document.getElementById("no_tasks_list");
            delete_no_task_list.remove();
        }        
        localStorage.setItem ("tasks", JSON.stringify(tasks));
    });
}

//функция удаления задачи

function deleteTask(button){
    const ToDoList=JSON.parse(localStorage.getItem("tasks"));
    const li2=button.parentElement;
    const li=li2.parentElement;
    const sp=li.querySelector("span").textContent;
    const idx = ToDoList.findIndex(obj => obj.text === sp.trim());    
    console.log(idx);
    if (idx!==-1){
        ToDoList.splice(idx,1);        
    }
    console.log(ToDoList);
    li.remove();
    localStorage.setItem("tasks", JSON.stringify(ToDoList));  
    if (ToDoList.length===0){
        const no_tasks=document.createElement("h2");
        no_tasks.innerHTML="У вас нет задач для выполнения.";
        no_tasks.id="no_tasks_list";
        document.body.appendChild (no_tasks);
    }
}

//Функция редактирования текста задачи по двойному клику

function editTask(span){
    const ToDoList=JSON.parse(localStorage.getItem("tasks"));
    const li=span.parentElement;
    const taskText=li.querySelector("span").textContent.trim();
    const New_taskText=prompt ("Редактирование задачи", taskText);
    if (New_taskText!==null || New_taskText.trim()!==""){
        const sp=li.querySelector("span").textContent;
        li.querySelector("span").textContent=New_taskText.trim();
        const idx = ToDoList.findIndex(obj => obj.text === sp.trim()); 
        if (idx!==-1){
           ToDoList[idx].text=`${New_taskText}`;
        }
        localStorage.setItem('tasks', JSON.stringify(ToDoList));
    }
}   

// Функция изменения статуса выполнения задачи 

function completedTask(span){
    const ToDoList=JSON.parse(localStorage.getItem("tasks"));
    // const li=span.parentElement;
    const li2=span.parentElement;
    const li=li2.parentElement;
    const taskText=li.querySelector("span").textContent.trim();    
    const status=confirm ("Вы хотите изменить статус выполнения задачи?");
    if(status){
        const idx = ToDoList.findIndex(obj => obj.text === taskText.trim());        
        ToDoList[idx].status=!ToDoList[idx].status;  
        localStorage.setItem('tasks', JSON.stringify(ToDoList)); 
        location.reload();  
    }
}

// Функция фильтрации/поиска задачи 

function filterTasks(){
    const filterInput= document.getElementById('filterTasks');
    const filterText=filterInput.value.toLowerCase();
    const taskList=document.getElementById('taskList');
    Array.from(taskList.children).forEach(li =>{
        const taskText=li.querySelector('span').textContent.toLowerCase();
        if (taskText.includes(filterText)){
            li.style.display='';
        } else{
            li.style.display='none';
        }
    })
}

// Кнопка "Показать все задачи"

function showAllTasks(){   
    location.reload();          
}

// Кнопка "Показать задачи в работе"

function showActiveTasks(){    
    const taskList=document.getElementById('taskList');
    const status="В работе";    
    Array.from(taskList.children).forEach(li =>{
        const taskText=li.textContent;
        if (taskText.includes(status)){
            li.style.display='';
        } else{
            li.style.display='none';
        }
    })    
}

// Кнопка "Показать завершенные задачи"

function showCompletedTasks(){
    const taskList=document.getElementById('taskList');
    const status="Задача выполнена";    
    Array.from(taskList.children).forEach(li =>{
        const taskText=li.textContent;
        if (taskText.includes(status)){
            li.style.display='';
        } else{
            li.style.display='none';
        }
    })    
}