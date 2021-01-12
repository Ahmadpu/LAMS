

var images_source = ["images/lawslider1.jpg","images/lawslider2.jpg","images/lawslider3.jpg","images/lawslider4.jpg","images/lawslider5.jpg"];

var pointer = 0;
var img = document.getElementById("lawslider");
function slides(){

     document.getElementById("lawslider").src=images_source[pointer];
    if(pointer<(images_source.length-1))
    pointer++;
    else
    pointer=0;

}
setInterval(slides,5000)
  
function reRenderImage(img_src) {
    img.removeAttribute("src");
    img.setAttribute("src", img_src);
}

function changeimage(val){
    pointer +=val;
    if(pointer < 0){
        pointer = 5;
        reRenderImage(images_source[pointer]);
    }
else if(pointer > 5){
pointer = 0;
reRenderImage(images_source[pointer]);
}
else
{
reRenderImage(images_source[pointer]);
}
}







/*---form validation-------*/
    function valiateform(){
        /*----for name----*/
        var x = document.forms["myform"]["name"].value;
        var y = document.forms["myform"]["phone"].value;
        var z = document.forms["myform"]["email"].value;
        var n = document.forms["myform"]["pswd"].value;

        if (x==""){
            alert("Name must be filled out");
            return false;
        }
        else if(x=="integer")
        {
            alert("Number Not Fill That field");
        }
               /*----for phone----*/
              
              else if (y==""){
                   alert("Phone must be filled out");
                   return false;
               }

                 /*----for email ----*/   
              else if (z==""){
                alert("Email must be filled out");
                return false;
            }

                 /*----for password----*/
            else if (n==""){
                alert("Password must be filled out");
                return false;
            }
    }
/*---form validation End-------*/