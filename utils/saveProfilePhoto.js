const imageMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

function saveProfilePhoto(clubmember, profilePhotoEncoded) {
  if (profilePhotoEncoded != null) {
    const profilePhoto = JSON.parse(profilePhotoEncoded);
    if (profilePhoto != null && imageMimeTypes.includes(profilePhoto.type)) {
      clubmember.profileImage = new Buffer.from(profilePhoto.data, 'base64');
      clubmember.profileImageType = profilePhoto.type;
    }
  }
}

module.exports = saveProfilePhoto;
