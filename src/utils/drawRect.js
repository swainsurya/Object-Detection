export const drawRect = (detections , ctx) => {
    detections.forEach(prediction => {
        // Get result for prediction
        const [x,y,width,height] = prediction['bbox']
        const text = prediction['class']

        // set styling
        const color = "white"
        ctx.strokeStyle = color
        ctx.font = '22px sans'
        ctx.lineWidth = 3
        ctx.fillStyle = color

        // Draw reactangle and text
        ctx.beginPath()
        ctx.fillText(text,x,y-20)
        ctx.rect(x,y,width,height)
        ctx.stroke()
    })
}