<?php
echo "
  <form class='content__credentials content__credentials--register' method='POST'>
    <label class='credentials__label credentials__label--fullname' for='fullname'>Full Name:</label>
    <input type='text' placeholder='Linus Torvalds' class='credentials__input credentials__input--fullname' name='fullname' id='fullname'>
    <label class='credentials__label credentials__label--username' for='username'>Username:</label>
    <input type='text' placeholder='sudo1337' class='credentials__input credentials__input--username' name='username' id='username'>
    <label class='credentials__label credentials__label--password' for='password'>Password:</label>
    <input type='password' placeholder='&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;' class='credentials__input credentials__input--password' name='password' id='password'>
    <label class='credentials__label credentials__label--confirm' for='password_confirm'>Confirm Password:</label>
    <input type='password' placeholder='&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;' class='credentials__input credentials__input--confirm' name='password_confirm' id='password_confirm'>
    <input type='hidden' name='register'>
    <button class='credentials__button credentials__button--register'>REGISTER</button>
    <span class='credentials__alternative credentials__alternative--login'>Already registered? <a href='?'>Login here.</a></span>
  </form>
";
?>
