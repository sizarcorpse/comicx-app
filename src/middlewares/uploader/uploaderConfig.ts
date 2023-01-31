export const config = {
  fieldsName: {
    AVATAR: "avatar-photo-file",
    COVER: "cover-photo-file",
    RENDER: "render-photo-file",
  },
  storageDir: {
    STORAGE_DIR: "uploads",
    CONFIG_UPLOAD_DIR: "uploads/.config",
    RENDER_UPLOAD_DIR: "uploads/",
  },
  ref: ["Tag"],
};

/* 
For uploading avatar and cover photo files you must specify the following:

`ref` parameter [Tag:string|Category:string]
`title` parameter 
*/
