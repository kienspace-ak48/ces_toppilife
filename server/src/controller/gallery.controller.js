const CNAME = "gallery.controller.js ";
const VNAME ="admin/gallery";

const galleryController = ()=>{
    return {
        Index: async(req, res)=>{
            res.render(CNAME+'/index');
        }
    }
}