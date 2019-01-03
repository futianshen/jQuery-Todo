document.addEventListener("DOMContentLoaded", e => {
  let inputSubmit = qs('.input__submit')
  el(inputSubmit, 'click', e => {
    addTodo()
    resetProgressBar()
  })
})

$(document).ready((e) => {
  $('.input__box').on('keyup', e => {
    if(e.keyCode===13) {
      addTodo()
      resetProgressBar()
    }
  })
  let keyword
  $('.list').on('dblclick', '.list__keyword', e => {
    //取出表單資料
    keyword = $(e.target).text()
    $(e.target).parent().find('.list__checkbox').remove()
    $(e.target).closest('.list__todo').find('.button--delete').removeClass('btn-primary').removeClass('button--delete').addClass('btn-secondary').addClass('button--modify').text('Modify')
    $(e.target).closest('.list__keyword').replaceWith(`
      <input class="todo__modify" value="${keyword}">
    `)
  })
  $('.list').on('click', '.button--modify', e => {
    modifyTodo(e, keyword)
  })
  $('.list').on('keyup', '.todo__modify', e => {
    if(e.keyCode===13) {
      modifyTodo(e, keyword)
    }
    if(e.keyCode===27) {
      if(window.confirm('確定要取消修改？資料將恢復原狀。')){
        modifyBackTodo(e)
        $(e.target).closest('.list__content').prepend(`<input type="checkbox"  class='list__checkbox form-check-input'/>`)
        $(e.target).closest('.todo__modify').replaceWith(`<p class='list__keyword'>${keyword}</p>`) 
      }
    }
  })

  $('.list').on('click', '.button--delete', e => {
    if(window.confirm('確定要刪除嗎？')) {
      deleteTodo(e)
      resetProgressBar()
    }
  })

  $('.list').on('click', '.list__checkbox', e => {
    checkTodo(e)
    resetProgressBar()  
  })

  $('.filters').click(e => {
    if($(e.target).hasClass('filter__all')) {
      $('.filter__all').removeClass('btn-secondary').addClass('btn-info')
      $('.filter__done').removeClass('btn-success').addClass('btn-secondary')
      $('.filter__undone').removeClass('btn-danger').addClass('btn-secondary')
      $('.todo__undone').hide()
      $('.todo__done').hide()
      $('.list__todo').show()
    }
    if($(e.target).hasClass('filter__done')) {
      $('.filter__done').removeClass('btn-secondary').addClass('btn-success')
      $('.filter__all').removeClass('btn-info').addClass('btn-secondary')
      $('.filter__undone').removeClass('btn-danger').addClass('btn-secondary')
      $('.list__todo').hide()
      $('.todo__undone').hide()
      $('.todo__done').show()
    }
    if($(e.target).hasClass('filter__undone')) {
      $('.filter__undone').removeClass('btn-secondary').addClass('btn-danger')
      $('.filter__all').removeClass('btn-info').addClass('btn-secondary')
      $('.filter__done').removeClass('btn-success').addClass('btn-secondary')
      $('.list__todo').hide()
      $('.todo__done').hide()
      $('.todo__undone').show()
    }
  })
})
// vanilla.js
function addTodo() {
  let inputBox = qs('.input__box')
  let value = inputBox.value
  if(value!=='') {
    qs('.input__box').classList.add('is-valid')
    qs('.input__box').classList.replace('is-invalid', 'is-valid')     
    qs('.input__submit').classList.replace('btn-primary', 'btn-success')
    let list = qs('.list')
    let li = ce('li')
    let divContent = ce('div'), divBtn = ce('div')
    let btnDel = ce('button')
    let input = ce('input')
    let p = ce('p')
    li.className = 'list__todo list-group-item justify-content-between align-items-center todo__undone'
    input.className = 'list__checkbox form-check-input'
    input.setAttribute('type', 'checkbox')
    p.innerText = value
    p.className = 'list__keyword'
    divContent.className = 'list__content'
    divContent.append(input)
    divContent.append(p)
    btnDel.className = 'list__button button--delete btn btn-primary'
    btnDel.innerText = 'Delete'
    btnDel.setAttribute('type', 'button')
    divBtn.className = 'list__buttons'
    divBtn.append(btnDel)
    li.append(divContent)
    li.append(divBtn)
    list.prepend(li)
    qs('.input__box').value = ''
    qs('.input__box').classList.add('valid')
    qs('.input__submit').classList.replace('btn-secondary', 'btn-success')
  } else {
    qs('.input__box').classList.add('is-invalid')
    qs('.input__box').classList.replace('is-valid', 'is-invalid')
    qs('.input__submit').classList.replace('btn-secondary', 'btn-primary')
    qs('.input__submit').classList.replace('btn-success', 'btn-primary')
  }
}
function qs(slct) {
  return document.querySelector(slct)
}
function el(target, event, callback) {
  return target.addEventListener(event, callback)
}
function ce(tag) {
  return document.createElement(tag)
}

// jQuery 
function checkTodo(e) {
  $(e.target).closest('.list__todo').toggleClass('todo__undone').toggleClass('todo__done')
  let checkbox = $(e.target).find('.list__checkbox')
  checkbox.prop("checked", !checkbox.prop("checked"))
}
function deleteTodo(e) {
  const element = $(e.target)
  if($(e.target).hasClass('button--delete')) element.closest('.list__todo').remove()
}
function modifyTodo(e, keyword) {
  if($('.todo__modify').val()==='') {
    alert('內容不能為空')
  } else {
    if(window.confirm('確定要修改嗎？')) {
      modifyBackTodo(e)
      $(e.target).closest('.list__todo').find('.todo__modify').replaceWith(`
        <p class='list__keyword'>${$('.todo__modify').val()}</p>
      `)
    } else {
      modifyBackTodo(e)
      $(e.target).closest('.list__todo').find('.todo__modify').replaceWith(`
        <p class='list__keyword'>${keyword}</p>
      `)
    }
  }
  
}

function modifyBackTodo(e) {
  $(e.target).closest('.list__todo').find('.button--modify').removeClass('btn-secondary').removeClass('button--modify').addClass('btn-primary').addClass('button--delete').text('Delete')
  $(e.target).closest('.list__todo').find('.list__content').prepend(`
    <input type="checkbox"  class='list__checkbox form-check-input'/>
  `)
  if($(e.target).closest('.list__todo').hasClass('todo__done')){
    let checkbox = $(e.target).closest('.list__todo').find('.list__checkbox')
    checkbox.prop("checked", true)
  }
}

function resetProgressBar() {
  const todoCount = $('.list').children().length
  const todoCheckbox = $('.list').find('.list__checkbox')
  let counter = 0
  for(let i=0; i<todoCheckbox.length; i++) {
    if(todoCheckbox[i].checked) counter++
  }
  let percent = (counter/todoCount)*100
  if(todoCount===0) $('.progress').prop(`style`, 'visibility: hidden')
  else $('.progress').prop(`style`, 'visibility: visible')
  $('.progress-bar').prop(`style`, `width: ${percent}%`)
}



