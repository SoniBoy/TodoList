$(document).ready(function()
{

  let list_array = []; // to store list items in an array
  let check = [];     // to store whether a list item is checked/unchecked
  // index of the list item in check[] acts as id of that item

  $.get('/' , retrieve);
  // if data available in local storage
   if(localStorage.getItem("local_key_items")!==null)
    {
     list_array = JSON.parse(localStorage.getItem("local_key_items"));
     check = JSON.parse(localStorage.getItem("local_key_check"));
     makeList();
    }

  //checkbox event
  $(document).on("change" , ":checkbox" , function()
  {
    if(this.checked===true)
    check[$(this).parent().parent().attr('id')] ='true'; // storing selected item's checked/unchecked info in check[]

	else
	check[$(this).parent().parent().attr('id')] ='false';

	store();
  });

  function store()
  {
    $.post('/',{ dt : list_array , ch :check} , makeList);
  }

  function retrieve(data)
  {
    
    if(!(jQuery.isEmptyObject(data)))
    {
     let dta = JSON.parse(data);
     list_array = dta['dt'];
     check = dta['ch'];
	 
     makeList();
    }
  }

  // adding new task event
  $('#addTask').click(function()
  {
    let txt = $('#txtid').val();
    if(txt==="")
    alert("please enter some value");
    else
    {
      list_array.push(txt);
      check.push('false');
      store();
      $('#txtid').val("");  // clear text in textbox after adding item
    }
   });

  // deleting tasks event
  $( '#delTask').click(function()
  {
    let tail = 0;
    let len = list_array.length;
    for(let i = 0; i < len  ; i++)
    {
      if(check[i]!=='true')
      {
        list_array[tail] = list_array[i];
        tail = tail + 1;
      }
    }
    list_array.splice(tail);
	check.splice(tail);
    check.fill('false');

    store();
});


  function swap(selected , target)
  {
    let temp = list_array[selected];
    list_array[selected] = list_array[target];
    list_array[target] = temp;

    temp = check[selected];
    check[selected] = check[target];
    check[target] = temp;

    store();
  }

  // shifting selected item up event
  $(document).on("click" , "#up" , function()
  {
   swap( $(this).parent().parent().attr('id') ,  $(this).parent().parent().prev().attr('id') );
  });

  // shifting selected item down event
  $(document).on("click" , "#down" , function()
  {
   swap( $(this).parent().parent().attr('id') , $(this).parent().parent().next().attr('id') );
  });


  // sorting tasks event
  $( '#sortTask').click(function()
  {
    let count = 0;
    let temp =[];
    let len = list_array.length;

    for(let i = 0; i < len ; i++)
    {
      if(check[i]!=='true')
      {
        list_array[count] = list_array[i];
        check[count] = 'false';
        count = count + 1;
      }
      else
      temp.push(list_array[i]);
    }

    list_array.splice(count);
    let temp_len = temp.length;

    for(let i = 0 ; i < temp_len ; i++ , count++ )
    {
      check[count]='true';
      list_array.push(temp[i]);
    }
    store();

  });

  // make list from items stored in list_array[] aka refresh
  function makeList()
  {
    $('ul').empty();
    let len = list_array.length;
    let i = 0;

    if(len===1)
    {
      $('ul').append('<li class = "row" > <span class = "col-lg-1 col-1" > <input type="checkbox" > </span>  "'+list_array[i]+'" </li>');

    }

	else
	{

      for( i = 0 ; i < len ; i++)
      {
       if(i===0)
        $('ul').append('<li class="row" > <span  class="col-lg-1 col-1"><input type="checkbox"> </span> <div class="col-lg-8 col-8">  "'+list_array[i]+'"</div><span class="col-lg-1 col-1"><button id ="down" type ="submit"> <i class="fas fa-chevron-circle-down"></i> </button> </span>   </li>');

       else if(i===len-1)
        $('ul').append('<li class="row" > <span class="col-lg-1 col-1"> <input type="checkbox"> </span><div class="col-lg-8 col-8"> "'+list_array[i]+'" </div><span class="col-lg-1 col-1"> <button id ="up" type="submit"><i class="fas fa-chevron-circle-up"></i></button> </span>   </li>');

       else
        $('ul').append('<li class="row" >  <span class="col-lg-1 col-1"> <input type="checkbox"> </span><div class="col-lg-8 col-8"> "'+list_array[i]+'" </div><span class="col-lg-1 col-1"> <button id ="up" type="submit"><i class="fas fa-chevron-circle-up"></i></button> </span> <span> <button type="submit" id="down" ><i class="fas fa-chevron-circle-down"></i></button> </span>  </li>');


     }
	}

    i = 0;
       //adding id's to list items
  $("#ulid li").attr('id' , function(i)
    {

      if(check[i] === 'true')
      {
        $(this).toggleClass("completed"); // // striking off selected list item
        $(this.children[0].children[0].checked=true);
       }
      return i++ ;
    });

         localStorage.setItem("local_key_items" , JSON.stringify(list_array));
        localStorage.setItem("local_key_check" , JSON.stringify(check));
  }
  

});
