function checkAuth() {
  const isAuth = localStorage.getItem("dealerAuth");
  if (isAuth !== "true") {
    window.location.href = "/dealer/index.html";
  }
}
function login(password) {
  if (password === DEALER_PASSWORD) {
    localStorage.setItem("dealerAuth", "true");
    window.location.href = "/dealer/home.html";
  } else {
    alert("รหัสไม่ถูกต้อง");
  }
}
function logout() {
  localStorage.removeItem("dealerAuth");
  window.location.href = "/dealer/index.html";
}
