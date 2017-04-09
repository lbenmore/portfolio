<?php
  echo "
    <form class='content__credentials content__credentials--login' method='POST'>
      <label class='credentials__label credentials__label--username' for='username'>Username:</label>
      <input type='text' placeholder='sudo1337' class='credentials__input credentials__input--username' name='username' id='username'>
      <label class='credentials__label credentials__label--password' for='password'>Password:</label>
      <input type='password' placeholder='&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;' class='credentials__input credentials__input--password' name='password' id='password'>
      <input type='hidden' name='login'>
      <button class='credentials__button credentials__button--login'>LOG IN</button>
      <span class='credentials__alternative credentials__alternative--register'>Not registered? <a href='?register'>Register here.</a></span>
    </form>
  ";
?>
