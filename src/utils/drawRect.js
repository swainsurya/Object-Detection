export const drawRect = (detections , ctx) => {
    detections.forEach(prediction => {
        // Get result for prediction
        const [x,y,width,height] = prediction['bbox']
        const text = prediction['class']

        // set styling
        const color = "#"+Math.floor(Math.random()*9999999).toString(16)
        ctx.strokeStyle = color
        ctx.font = '22px sans'
        ctx.fillStyle = color

        // Draw reactangle and text
        ctx.beginPath()
        ctx.fillText(text,x,y)
        ctx.rect(x,y,width,height)
        ctx.stroke()
    })
}