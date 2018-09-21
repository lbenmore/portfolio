loadTrack = (id) => {
  let data = {
    track_id: id,
  };
  loadPage('track', data);
}

uploadNewTrack = () => {
  // if ($$('#upload-new-track').files.length) {
    // check that file is usable
      // do ajax request that...
        // requires user id
        // requires file name
        // uploads file to user id attachments folder
        // returns payload with new track id
        // call loadTrack with that id
        // for now, use dummy data
        loadTrack(999);
  // } else {
    // error messaging for no file given
  // }
}

populateTracks = (target, tracks, options) => {
  let html = '';

  for (let track of tracks) {
    html += `
      <!-- track -->
      <div class='track m-t p-t b-t b-red'>
        <!-- track name -->
        <div class='text-lg font-bold m-b-xs font-underline' onclick='loadTrack(${track.id})'>${track.track_name}</div>
        <!-- track origin user -->
        <div class='m-b-xs'>${track.user_email}</div>
        <!-- track social -->
        <div class='text-xs m-b-sm'>
          <i class='fa fa-thumbs-up'></i> <span class='b-r b-white p-r-sm m-r-sm'>${track.likes}</span>
          <i class='fa fa-comments'></i> <span class=''>${track.comments.length}</span>
        </div>
        <!-- track tags -->
        <div class='text-xs'>
          <i class='fa fa-tags'></i>
          ${
            track.tags.map((tag) => `<span class='tag m-r-sm bg-black-75 b-radius p-v-xs p-h-sm'>${tag}</span>`).join('')
          }
        </div>
      </div>
      <!-- end track -->
    `
    target.innerHTML = `${html}`;
  }

  if (options) {
    if (options.append) {
      target.innerHTML += options.append;
    }
  }
}

populateTracks($$('.top-voted .content'), dummy_track_data, {append: `<div class='m-t font-bold font-underline text-u-c l-s-2'>View More</div>`});
populateTracks($$('.most-recent .content'), dummy_track_data.concat(dummy_track_data).concat(dummy_track_data), {append: `<div class='m-t font-bold font-underline text-u-c l-s-2'>Load More</div>`});
