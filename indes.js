


var option = {
    messageDelay:120,
    dialogClick:true
}


async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function message(text) {
    
    return new Promise(resolve=>{
        const dialog = document.querySelector(".dialog")
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

        document.body.addEventListener("click",function myclick(){
            if(dialog.dataset.next==="true"){
                document.body.removeEventListener("click",myclick)
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

const locker = document.getElementById("locker")
// drag(locker)
function drag(element) {

    let state = false,
        beforeX = 0,
        beforeY = 0,
        originX = 0,
        originY = 0,
        x = 0,
        y = 0,
        boundX = 0,
        boundY = 0

    element.addEventListener("mousedown", e => {
        element.style.position = "fixed"
        
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
        console.log(1)

        state = true

    })

    window.addEventListener("mouseup", e => {
        state = false
        element.style.position = null
        element.style.top = null
        element.style.left = null
        element.style.transform = null
    })

    window.addEventListener("mousemove", e => {

        if (!state) { return }

        x = originX + e.x - beforeX
        y = originY + e.y - beforeY

        if (x < 0) { x = 0 }
        if (x > boundX) { x = boundX }
        if (y < 0) { y = 0 }
        if (y > boundY) { y = boundY }

        element.style.left = `${x}px`
        element.style.top = `${y}px`
    })

    element.addEventListener("touchstart", e => {
        element.style.position = "fixed"
        const css = window.getComputedStyle(element)
        if (css.position != "absolute" && css.position != "fixed") {
            console.log("position needs absolute or fixed")
            return
        }
        if(element.dataset.drag!="true"){return}
        

        beforeX = e.targetTouches[0].clientX
        beforeY = e.targetTouches[0].clientY
        originX = parseInt(css.left)
        originY = parseInt(css.top)
        boundX = window.innerWidth
        boundY = window.innerHeight

        
        state = true
    })

    window.addEventListener("touchend", e => {
        state = false
        element.style.position = null
        element.style.top = null
        element.style.left = null
        element.style.transform = null
    })

    window.addEventListener("touchmove", e => {

        if (!state) { return }

        x = originX + e.targetTouches[0].clientX - beforeX
        y = originY + e.targetTouches[0].clientY - beforeY

        if (x < 0) { x = 0 }
        if (x > boundX) { x = boundX }
        if (y < 0) { y = 0 }
        if (y > boundY) { y = boundY }

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
        textarea.append(target.innerText) 
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

function copy(targetElement){
    const inter = document.querySelector(".interaction")
    const copyElement = targetElement.cloneNode(true)
    copyElement.id = "copy-element"
    inter.dataset.content = targetElement.id
    inter.append(copyElement)

}

function addActor(){    

    const actor = [
        ["sofa","???????????????","???????????????"],
        ["lamp","????????????"],
        ["clock","????????????"],
        ["closet","????????????"],
        ["bed","?????????"],
        ["plant","????????????"],
        ["safe_box","???????????????"],
        ["border","???????????????"],
        ["table","????????????"],
        ["pancel","????????????"],
        ["switch","????????????"],
    ]
        
    actor.forEach(i=>{
        const target = document.getElementById(i[0])
        target.addEventListener("click",async()=>{
            if(document.querySelector("#copy-element")){return}    
            option.dialogClick=false
            const dialog = document.querySelector(".dialog")   
            const close_btn = document.querySelector(".interaction .close_btn")
            close_btn.classList.add("disable")
            interaction()
            copy(target)
            for(let j = 1; j<i.length; j++){
                await message(i[j])
            }
            close_btn.classList.remove("disable")
            dialog.dataset.state = ""
        })
    })

} 


addActor()
ini()
async function ini() {

    const close_btn = document.querySelector(".interaction .close_btn")    
    const stage = document.querySelector(".stage")
    const stage_background = document.querySelector(".stage .background")
    const dialog = document.querySelector(".dialog")      
    const switcher = document.getElementById("switch")
    const toolBox = document.querySelector("footer .toolBox")
    stage.scroll((stage.scrollWidth-stage.clientWidth)/2,0)
    stage_background.classList.add("dark")
    toolBox.style.display = "none"
    // let state = dialog.dataset.state
    await message("????????????????????????????????????")
    while(true){
        await message("??????????????????????????????")        

        close_btn.classList.add("disable")

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
    toolBox.removeAttribute("style")
    copy(switcher)
    interaction()
    close_btn.classList.add("disable")
    await message("??????????????????")
    await message("????????????????????????")
    await message("??????????????????????????????????????????????????????")
    


    close_btn.classList.remove("disable")
    dialog.dataset.state = ""
    stage_background.classList.remove("dark")
    interaction()
}

const hand = document.getElementById("hand")
drag(hand)