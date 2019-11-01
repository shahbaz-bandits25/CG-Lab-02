
window.onLoad = myInit();

let yAxis=false;
let activeColor='red';


function myInit()
{
    document.getElementById("imageFile").addEventListener("change", handleFiles);

    myDisplay();
}

function myDisplay()
{
    alert("Inside my Display");

    var cvs = document.getElementById("canvas")
    var ctx = cvs.getContext('2d');

    var rect = {
        x:0,
        y:0,
        width:200,
        height:100
    };

    cvs.addEventListener('click', function(evt){
    var mousePos = getMousePos(cvs ,evt);

    if(isInside(mousePos , rect))
    {
        alert('clicked insdie rect');

    }
    else
    {
        alert('clicked outside rect');
    }
} , false);

const path = new Path2D()
path.rect(0, 0 , 200 ,100)
path.rect(25 ,72 ,32 ,32)
path.closePath()


ctx.fillStyle = "#FFFFFF"
ctx.fillStyle = "rgba(225,225,225,0.5)"
ctx.fill(path)
ctx.lineWidth = 2
ctx.strokeStyle = "#000000"
ctx.stroke(path)



}

function isInside(mouse_pos , rect)
{
    
    return mouse_pos.x > rect.x && mouse_pos.x < rect.x+rect.width && mouse_pos.y < rect.y+rect.height && mouse_pos.y > rect.y 

}

function getMousePos(canvas , event)
{
    var rect = canvas.getBoundingClientRect();
    return{
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };

}



function handleFiles() {
    var theGoods = document.getElementById('imageFile').files[0];
    var img = new Image();
    var reader = new FileReader();
    reader.addEventListener("load", function() { img.src = reader.result; });
    img.onload = function() { calcAndGraph(img); }
    if (theGoods) { reader.readAsDataURL(theGoods); }
  }

  function calcAndGraph(img) {
    let rD={}, gD={}, bD={};
    let cv = document.getElementById("canvas");
    let ctx = cv.getContext("2d");
    cv.width = img.width;
    cv.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const iD=ctx.getImageData(0, 0, cv.width, cv.height).data;
    
    for (var i=0; i<256; i++) { rD[i]=0; gD[i]=0; bD[i]=0; }
    for (var i=0; i<iD.length; i+=4) {
      rD[iD[i]]++;
      gD[iD[i+1]]++;
      bD[iD[i+2]]++;
    }
    histogram({rD, gD,bD});
  }


function histogram(data)
{
    let W=800;
    let H= W/2;
    const svg = d3.select('svg');
    const margin = {top: 20, right: 20, bottom: 30, left: 50};
    const width =W - margin.left - margin.right;
    const height =H -margin.top -margin.bottom;
    let q = document.querySelector('svg');
    q.style.width=W;
    q.style.height=H;
    if(yAxis){d3.selectAll("g.y-axis").remove();yAxis=false}
    function graphComponent(data, color)
    {
        d3.selectAll(".bar-"+color).remove();
        var data = Object.keys(data).map(function(key){return {freq:data[key], idx:+key}});
        
        var x =d3.scaleLinear()
                .range([0,width])
                .domain([0, d3.max(data, function(d){return d.idx;})]);

        var y=d3.scaleLinear()
            .range([height,0])
            .domain([0, d3.max(data,function(d) {return d.freq;})]);

        var g = svg.append("g")
           .attr("transform","translate("+margin.left+","+margin.top+")");
        if(!yAxis)
        {
            yAxis=true;
            g.append("g")
            .attr("class","y-axis")
            .attr("transform","translate("+ -2 + ",0")
            .call(d3.axisLeft(y).ticks(10).tickSizeInner(10).tickSizeOuter(2));
        }
        g.selectAll(".bar-"+color)
          .data(data)
          .enter().append("rect")
          .attr("class","bar-"+color)
          .attr("fill",color)
          .attr("x",function(d){return x(d.idx);})
          .attr("y",function(d){return y(d.freq);})
          .attr("width",2)
          .attr("opacity",0.8)
          .attr("height",function(d){return height - y(d.freq);})
    }
    graphComponent(data.gD,"green");
    graphComponent(data.bD,"blue");
    graphComponent(data.rD,"red");

}






  
  function handleFiles() {
    var theGoods = document.getElementById('imageFile').files[0];
    var img = new Image();
    var reader = new FileReader();
    reader.addEventListener("load", function() { img.src = reader.result; });
    img.onload = function() { calcAndGraph(img); }
    if (theGoods) { reader.readAsDataURL(theGoods); }
  }

  
  function calcAndGraph(img) {
    let rD={}, gD={}, bD={};
    let cv = document.getElementById("canvas");
    let ctx = cv.getContext("2d");
    cv.width = img.width;
    cv.height = img.height;
    ctx.drawImage(img, 0, 0);
    const iD=ctx.getImageData(0, 0, cv.width, cv.height).data;
    for (var i=0; i<256; i++) { rD[i]=0; gD[i]=0; bD[i]=0; }
    for (var i=0; i<iD.length; i+=4) {
      rD[iD[i]]++;
      gD[iD[i+1]]++;
      bD[iD[i+2]]++;
    }
    histogram({rD, gD,bD});
  }


  function amplify(e) {
    const colors = ['red', 'green', 'blue'];
    const boost = e.target.id;
    if (boost=='blend') {
       document.querySelectorAll('rect').forEach(bar=>{
        bar.style.opacity = 0.7;
      });
    }
    else {
      activeColor=boost;
      const deaden = colors.filter(e=>e!==boost);
      document.querySelectorAll('.bar-'+boost).forEach(bar=>{
        bar.style.opacity = 1.0;
      });
      deaden.forEach(color=>{
        document.querySelectorAll('.bar-'+color).forEach(bar=>{
        bar.style.opacity = 0.2;
        });
      });
    }
  }

  function myInit()
  {  
      //alert("inside myInit Function");
      document.getElementById("imageFile").addEventListener("change",handleFiles);
      document.querySelectorAll("button.focuser").forEach(button=>{
          button.addEventListener("click",amplify);
      });
      myDisplay();
  }

  document.addEventListener("DOMContentLoaded",function(event){
    // console.log("Dom loaded");
    // var image=new Image();
    // image.onload=function(){calcAndGraph(image);}
    //  image.src='download.jpg';
    myInit();
})


