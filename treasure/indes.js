// const open = document.getElementById("open")
// open.onclick = function(){
//     document.documentElement.requestFullscreen()
// }

Height()
function Height(){
    let vh = window.innerHeight;
    let vmin = 0
    calcHeight()
    window.addEventListener("resize", function(){
        calcHeight()
    });
    function calcHeight(){
        vh = window.innerHeight;
        if(innerHeight>=innerWidth){
            vmin = innerWidth
        } else {
            vmin = innerHeight
        }
        document.documentElement.style.setProperty('--vh', `${vh}px`);    
        document.documentElement.style.setProperty('--vmin', `${vmin}px`); 
    }

}


setClockTime()
function setClockTime(){
    time()
    setInterval(time,1000)
    function time(){
        let current = new Date(Date.now())
        let h = current.getHours()
        let m = current.getMinutes()
        let s = current.getSeconds()
        let hour = h + (m*60+30)/3600
        let min = m + s/60
        let sec = s
    
        document.documentElement.style.setProperty('--hour', `${hour*30}deg`)
        document.documentElement.style.setProperty('--sec', `${sec*6}deg`)
        document.documentElement.style.setProperty('--min', `${min*6}deg`)
    }

}

function checkReadyState(win=window){return new Promise(resolve=>{const clock = setInterval(function(){let target = win.document.readyState;if(target==="complete"){clearInterval(clock);console.log("complete");resolve();}},50);});};

function detectClass(className){
    return new Promise((resolve) => {
        setInterval(function(){
            // if(!document.getElementById("copy-element")){return}
            if(document.getElementById("copy-element").classList.contains(className)){
                resolve("123")
                return
            }
        },50)
    })
}

var option = {
    messageDelay:90,
    dialogClick:true,
    dialogPause:false,
    currentTool:"",   
    safeBoxPassword:0 
}

var answer = {
    hand:{
        question:"switch",
        result:function(){
            const copyElement = document.querySelector("#copy-element") 
            const stage_background = document.querySelector(".stage .background")           
            copyElement.classList.toggle("turn-off")
            document.getElementById("switch")
            .classList.toggle("turn-off")
            stage_background.classList.toggle("dark")
            option.dialogPause = false            
        }
    },
    pancel:{
        question:"note",
        result:function(){
            const note_scribble = document.querySelector("#note .scribble")
            const copyElement_scribble = document.querySelector("#copy-element .scribble")
            note_scribble.classList.add("scribble-go")
            copyElement_scribble.classList.add("scribble-go")
        }
    }
}



async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function message(text) {
    
    return new Promise(resolve=>{
        const dialog = document.querySelector(".dialog")
        const inter = document.querySelector(".interaction")
        dialog.dataset.state = "running"
        dialog.dataset.next = "false"
        if (document.querySelector(".dialog > p")) {
            document.querySelector(".dialog > p").remove()
        }
        var msg = document.createElement("p")
        document.querySelector(".dialog").append(msg)
        msg = document.querySelector(".dialog > p")
        let t = []
        for (let i = 0; i < text.length; i++) {
            t[i] = document.createElement("span")
            t[i].innerText = text[i]
            t[i].className = "hideText"
            msg.appendChild(t[i])
        }

        i = 0
        const type = setInterval(function () {
            if(dialog.dataset.state === "finish"){                    
                clearInterval(type)
                dialog.dataset.next = "true"                    
                dialog.querySelector("p").lastChild.scrollIntoView()
                return
            }
            if (i >= text.length) {
                clearInterval(type)
                dialog.dataset.state = "finish"
                dialog.dataset.next = "true"
                return
            }
            t[i].className = ""
            t[i].scrollIntoView()
            i = i + 1
        }, option.messageDelay)

        document.body.addEventListener("click",function myclick(e){
            if(option.dialogPause===true){return}
            if(dialog.dataset.next==="true"){
                document.body.removeEventListener("click",myclick)
                resolve()
            }
        })

        inter.addEventListener("pointerup",()=>{
            if(!answer[option.currentTool]){return}
            if(answer[option.currentTool].question===inter.dataset.content){
                resolve()
            }              
        })

    })
    
    
}

function OpenGift() {
    const ribbon = document.getElementById("ribbon")
    const ribbon_rope = document.getElementById("ribbon_rope")
    const gift_cover = document.getElementById("gift_cover")
    ribbon.addEventListener("animationend", function ribbonAni(){
        gift_cover.classList.add("ani-gift-cover")
        ribbon.removeEventListener("animationend",ribbonAni)
    })
    ribbon_rope.addEventListener("animationend", function ribbon_ropeAni(){
        ribbon.classList.add("ani-ribbon")
        ribbon_rope.removeEventListener("animationend",ribbon_ropeAni)
    })
    ribbon_rope.classList.add("ani-ribbon_rope")

}

function drag(element) {

    let state = false,
        beforeX = 0,
        beforeY = 0,
        originX = 0,
        originY = 0,
        x = 0,
        y = 0


    element.addEventListener("pointerdown", e => {
        element.style.position = "fixed"
        element.style.pointerEvents = "none"
        const css = window.getComputedStyle(element)
        if (css.position != "absolute" && css.position != "fixed") {
            console.log("position needs absolute or fixed")
            return
        }
        if(element.dataset.drag!="true"){return}       
        beforeX = e.x
        beforeY = e.y
        originX = parseInt(css.left)
        originY = parseInt(css.top)
        boundX = window.innerWidth
        boundY = window.innerHeight
        state = true        
    })

    window.addEventListener("pointerup", e => {
        state = false
        element.style.position = null
        element.style.top = null
        element.style.left = null
        element.style.transform = null
        element.style.pointerEvents = null
    })

    window.addEventListener("pointermove", e => {
        element.releasePointerCapture(e.pointerId)
        if (!state) { return }
        if(window.innerWidth>window.innerHeight){
            x = originX + e.x - beforeX
            y = originY + e.y- beforeY
        }
        if(window.innerWidth<window.innerHeight){
            x = originX + (e.y - beforeY)
            y = originY - (e.x - beforeX)
        }

        
        element.style.left = `${x}px`
        element.style.top = `${y}px`



    })

}

document.body.addEventListener("click", e => {
    if(
        e.target.nodeName==="BUTTON"||
        e.target.dataset.type==="button"||
        option.dialogClick===false){return}
    option.dialogClick=true
    const dialog = document.querySelector(".dialog")
    if (dialog.dataset.state === "running") {
        dialog.dataset.state = "finish"
        return
    }
    if(dialog.dataset.state === "complete"){
        dialog.dataset.state = ""
    }
})

function interaction() {
    // setClockTime()
    const interaction = document.querySelector(".interaction")
    state = interaction.dataset.state
    interaction.addEventListener("transitionend", function foo(e) {
        interaction.removeEventListener("transitionend",foo)
        if (state === "close") { return }
        if( state === "open"){
            interaction.style.display = "none"
            if(document.querySelector("#copy-element")){
                document.querySelector("#copy-element").remove()
            }
        }
       
    })

    if (state === "close") {
        interaction.dataset.state = "open"
        interaction.removeAttribute("style")
    } else
    if (state === "open") {
        interaction.dataset.state = "close"        
    }
}   



// document.addEventListener("readystatechange",e=>{
//     console.log(e.target.readyState)
// })


async function chose(){
    const choseFrame = document.querySelector(".dialog .chose")
    choseFrame.dataset.show="true"
    const yes = document.querySelector(".dialog .chose .yes")
    const no = document.querySelector(".dialog .chose .no")
    return new Promise(resolve=>{

        yes.addEventListener("click",function foo(){
            yes.removeEventListener("click",foo)
            choseFrame.dataset.show=""
            resolve("yes")
        })
        no.addEventListener("click",function foo(){
            no.removeEventListener("click",foo)
            choseFrame.dataset.show=""
            resolve("no")
        })

    })


}

async function password(target,process){
    const parent = target.parentElement
    const textarea = parent.querySelector('textarea')
    if(process==="number"){
        if(textarea.value.length>=4){
            textarea.childNodes[0].remove()
        }
        textarea.append(target.dataset.value) 
        return
    }
    if(process==="reset"){
        textarea.innerText = ""
        return
    }
    if(process==="ok"){               

    }               
}

async function getSerialNumber(){
    const password = document.querySelector(".password")
    const passShow = document.querySelector(".password .pass-show")
    const submit = document.querySelector(".password .submit")        
    show(password,"show")
    return new Promise(resolve=>{
        submit.addEventListener("click",async function submit_click(){                
            if(passShow.value.length<4){
                passShow.innerText = ""
                message("?????????4??????????????????")
                return
            }
            submit.removeEventListener("click",submit_click)
            show(password,"hide")
            let pass = passShow.value
            passShow.innerText = ""
            message("??????????????????~")
            var data = {
                pass
            }
            const url = 'https://script.google.com/macros/s/AKfycbxF4sCS7DVjTg2T0ZvUUpzbxL44sq86Zez5xZImyVd0dLHTRQJBh7c7EaNRf8ExjC69/exec'
            fetch(url, {
                header:{
                    "Content-Type": "application/json;charset=utf-8",
                    },
                method: 'POST',
                body: JSON.stringify(data),
                })
                .then((response) =>  response.json())
                .then(text=>{
                return resolve(text)
            })
        })
    })

    
}

function show(targetElement,state="show"){     
    const inter = document.querySelector(".interaction")
    const stage_background = document.querySelector(".stage .background")    
    if(state==="show"){
        interaction()         
        inter.append(targetElement)
    } else
    if(state==="hide"){
        interaction() 
        stage_background.append(targetElement)
    } 
}

function tutorialAni(state){
    
    const finger = document.getElementById("index_finger")
    const hand = document.getElementById("hand")   
    if(state==="go"){
        hand.classList.add("shine-finger")
        hand.onanimationend = function(){        
            finger.style.display = "block"
            finger.classList.add("move-finger")
        }
    }
    if(state==="stop"){
        hand.classList.remove("shine-finger")
        finger.classList.remove("move-finger")
    }
}

function copy(targetElement){    
    const inter = document.querySelector(".interaction")
    const copyElement = targetElement.cloneNode(true)
    copyElement.id = "copy-element"
    inter.dataset.content = targetElement.id
    inter.append(copyElement)
}

function getTime(){
    const current = new Date(Date.now())
    return current.toLocaleString("zh-TW",{
        hour12:true,
        hour:"numeric",
        minute:"numeric",
    })
}


function safeBoxPassWord(target,state){
    const copyElement = document.getElementById("copy-element").querySelector(".box_door")
    const safe = document.querySelector(".box_door")
    if(state==="input"){
        const texts = target.parentElement.querySelectorAll("text")
        let result = ""
        texts.forEach(text=>{
            result+=text.childNodes[0].data
        })
        option.safeBoxPassword = result
        if(result==="1043"){
            copyElement.classList.add("open-door")
            safe.classList.add("open-door")
        }
        return
    }

    const text = target.parentElement.querySelector("text")
    const number = Number(text.childNodes[0].data)    
    step = Number(target.dataset.step)

    text.childNodes[0].data
    = number + step

    if(number + step<0){
        text.childNodes[0].data = 9

    }
    if(number + step>9){
        text.childNodes[0].data = 0

    }
    
}


function addActor(){    

    const actor = [
        ["sofa","???????????????","???????????????"],
        ["lamp","????????????"],
        ["clock","Func()"],
        ["closet","????????????"],
        ["bed","?????????"],
        ["plant","????????????"],
        ["safe_box","???????????????"],
        ["border","???????????????"],
        ["table","????????????"],
        ["note","????????????","??????????????????????????????"],
        ["switch","????????????"],
    ]


actor.forEach(i=>{        
        const target = document.getElementById(i[0])
        const close_frame = document.querySelector(".interaction + .close_frame")
        target.addEventListener("click",async()=>{            
            if(document.querySelector("#copy-element")){return}    
            option.dialogClick=false
            const dialog = document.querySelector(".dialog")   
            const stage_background = document.querySelector(".stage .background")
            interaction()
            copy(target)
            close_frame.classList.add("disable")
            stage_background.classList.add("disable")

            for(let j = 1; j<i.length; j++){
                if(j===i.length-1){
                    close_frame.classList.remove("disable")
                }

                if(i[j]==="Func()"){
                    await message("??????????????? " + getTime() + " ???")
                    continue
                }
                await message(i[j])
            }          

            stage_background.classList.remove("disable")
            dialog.dataset.state = ""            
        })
    })

} 

function toolBox(){
    const hand = document.getElementById("hand")
    drag(hand)
    const pancel = document.getElementById("pancel")
    const key = document.getElementById("key")
    
    tool(key)
    tool(pancel)


    function tool(element){
        element.onclick = async function(e){
            e.stopPropagation()
            const target = checkToolBox()
            const footer = document.querySelector("footer")
            const stage = document.querySelector(".stage")
            const stage_background = document.querySelector(".stage .background")
            const position = getPosition(element)
            element.onclick = null
            element.dataset.drag = "true"  
            
            element.style.top = position.top + "px"
            element.style.left = position.left + "px"
            element.style.width = position.w + "px"
            element.style.height = position.h + "px"
            
            await sleep(0)
            
            element.style.position = "fixed"
            element.style.transition = "1s all"
            element.style.zIndex = "999"
            element.style.width = `${target.offsetWidth}px`
            element.style.height = `${target.offsetHeight}px`

            element.style.top = `${target.offsetTop + footer.offsetTop}px`
            element.style.left = `${target.offsetLeft + stage.scrollLeft - stage_background.offsetLeft}px`
            element.style.padding = "7px"
            element.style.boxSizing = "border-box"
            
            element.ontransitionend = transitionend
            function transitionend(){
                target.append(element)
                element.style = null
                element.ontransitionend = null
                drag(element)
            }        
        }
    }


    function checkToolBox(){
        const boxs = document.querySelectorAll(".toolBox .item")
        for(let i = 0;i<boxs.length;i++){
            if(boxs[i].dataset.exist==="false"){  
                boxs[i].dataset.exist = "true"        
                return boxs[i]
            }
        }
    }
}

function solveQuestion(){
    const inter = document.querySelector(".interaction")
    window.addEventListener("pointerdown",down)
    
    function down(e){
        option.currentTool=e.target.id
        if(!option.currentTool){return} 
        window.addEventListener("pointermove",move)
        window.addEventListener("pointerup",up)
        inter.dataset.outline = false
    }

    function move(e){
        if(!option.currentTool){return}  
        if(!e.target.classList.contains("interaction")){
            inter.dataset.outline = false
            inter.style.backgroundColor = null
            return
        }   
        inter.dataset.outline = "true" 
        inter.style.backgroundColor = "rgba(255, 255, 255, 0.85)"    
    }

    function up(e){
        inter.removeAttribute("data-outline")
        inter.style.backgroundColor = null
        window.removeEventListener("pointermove",move)
        window.removeEventListener("pointerup",up)

        if(!e.target.classList.contains("interaction")){
             option.currentTool=null 
             return
            }
        if(!answer[option.currentTool]){
            option.currentTool=null 
            return
        }
        
        if(answer[option.currentTool].question===inter.dataset.content){            
            answer[option.currentTool].result()            
        }    
        option.currentTool=null
    }
}


async function ini() {

   
    const stage = document.querySelector(".stage")
    const stage_background = document.querySelector(".stage .background")
    const dialog = document.querySelector(".dialog")      
    const switcher = document.getElementById("switch")
    const toolBox = document.querySelector("footer .toolBox")
    const close_frame =  document.querySelector(".interaction + .close_frame")
    stage_background.classList.add("disable")
    close_frame.classList.add("disable")
    stage.scroll((stage.scrollWidth-stage.clientWidth)/2,0)    
    toolBox.style.display = "none"
    // let state = dialog.dataset.state
    await message("????????????????????????????????????")
    while(true){
        await message("??????????????????????????????")        



        let get = await getSerialNumber()
        console.log(get.serialNumber)
        if(get.serialNumber==="wrong password"){
            await message("??????????????????????????????")   
            await message("???????????????????????????????????????????????????")  
            await message("????????????????????????????????????")  
            let chose_result = await chose()
            if(chose_result==="yes"){
                continue
            }   
        } else
        if(get.serialNumber){
            await message("???????????????")                
        }
        break
    }

    await message("????????????")
    
    copy(switcher)
    interaction()

    await message("??????????????????")
    await message("????????????????????????")
    option.dialogPause = true
    toolBox.removeAttribute("style")  
    tutorialAni("go")
    await message("??????????????????????????????????????????????????????") 
    tutorialAni("stop")
    await message("??????????????????????????????")
    await message("?????????????????????????????????????????????????????????????????????????????????")
    
    dialog.dataset.state = ""
    interaction()
    close_frame.classList.remove("disable")
    stage_background.classList.remove("disable")
}


function startScenes(){
    const start  = document.querySelector(".start")
    const stage = document.querySelector(".stage")
    const header = document.querySelector("header")
    const footer = document.querySelector("footer")    
    const elements = [stage,header,footer]
    elements.forEach(elemenet=>{
        elemenet.style.display = "none"
    })
    start.style.display = "block"
    start.onclick = function(){
        var elem = document.documentElement;
        if (elem.requestFullscreen) {
        elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
        }
        start.style= null
        elements.forEach(elemenet=>{
            elemenet.style = null
        })        
    }
}


document.querySelector(".background").classList.remove("dark")

workFlow()

async function workFlow(){
    startScenes()
    addActor()
    toolBox()
    solveQuestion()
    ini()
}


function getPosition(target){
    const css = window.getComputedStyle(target)
    let w = 0
    let h = 0
    let top = 0
    let left = 0

    if(target.nodeName==="svg"){
        w = parseInt(css.width) 
        h = parseInt(css.height) 
    } else {
        w = target.offsetWidth
        h = target.offsetHeight
    }


    while(target){
        if(target.nodeName==="svg"){
            top+=parseInt(css.top) 
            left+=parseInt(css.left) 
            target = target.parentElement
            continue
        }
        top+=target.offsetTop
        left+=target.offsetLeft
        target = target.offsetParent
    }

    return {w,h,top,left}

}