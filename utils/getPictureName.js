export default function getPictureName(url){

    const ultimoSlash = url.lastIndexOf("/")
    const ultimoPunto = url.lastIndexOf(".")
    return url.substring(ultimoSlash+1, ultimoPunto)
    
} 