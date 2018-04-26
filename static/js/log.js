document.getElementById("login").addEventListener("click", function(){
  document.getElementById("log").setAttribute("action", "/login");
  document.getElementById("title").innerHTML="Welcome back!";
  document.getElementById("login").className="active";
  document.getElementById("signup").className="unactive";
});
document.getElementById("signup").addEventListener("click", function(){
  document.getElementById("log").setAttribute("action", "/signup");
  document.getElementById("title").innerHTML="Registration";
  document.getElementById("signup").className="active";
  document.getElementById("login").className="unactive";
});
