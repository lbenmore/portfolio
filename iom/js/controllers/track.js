let track = dummy_track_data.filter((trk) => trk.id == $$.getParam('track_id'))[0] || dummy_new_track;

$$('#track-name span:first-of-type').innerHTML = decodeURIComponent(track.track_name);
$$('#track-likes').innerHTML += track.likes;

$$('#track-media').setAttribute('src', `./assets/uploads/${track.user_id}/${track.file_name}`);
$$('#track-description').value = track.description;
for (let tag of track.tags) {
  $$('#track-tags').innerHTML += `<span class='tag m-r-sm bg-black-75 b-radius p-v-xs p-h-sm' contenteditable='true'>${tag}</span>`;
}
$$('#track-tags').innerHTML += `<input type='text' class='b-n b-b b-red text-white' style='background: transparent;'>`;
for (let comment of track.comments) {
  $$('#track-comments').innerHTML += `<div class='wrapper m-t bg-black-75 text-white'>${comment}</div>`
}

$$('#track-tags input').on('blur', (e) => {
  if ($$.exists(e.target.value)) {
    let span = document.createElement('span');
    span.className = 'tag m-r-sm bg-black-75 b-radius p-v-xs p-h-sm';
    span.setAttribute('contenteditable', 'true');
    span.innerHTML = e.target.value;
    $$('#track-tags').insertBefore(span, $$('#track-tags input'));
    $$('#track-tags input').value = '';
    setTimeout(() => { $$('#track-tags input').focus(); }, 100);
  }
});

$$('#new-comment').on('blur', (e) => {
  if ($$.exists(e.target.value)) {
    let div = document.createElement('div');
    div.className = 'wrapper m-t bg-black-75 text-white';
    div.innerHTML = e.target.value;
    $$('#track-comments').appendChild(div);
    $$('#new-comment').value = '';
  }
});

$$('#track-name i').on('tap', (e) => {
  ++track.likes;
  $$('#track-likes').innerHTML = track.likes;
});
