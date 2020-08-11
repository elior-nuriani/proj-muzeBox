export default{
    scrollFunc: (function(){
        window.addEventListener('scroll',() =>{
            const elHeader = document.querySelector('.app-header');
            elHeader.classList.toggle('fixed', window.scrollY > 0)
        })
    })()
}