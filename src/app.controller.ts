import { Controller, Post, Body, Req, Res, UnauthorizedException } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { validateRequest } from 'twilio/lib/webhooks/webhooks';


@Controller()
export class AppController {
  constructor() { }


  @Post('webhook')
  handleWhatsAppMessage(
    @Body() body: any,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {

    const twilioSignature = req.headers['x-twilio-signature'];

    // Verificar que la firma sea una cadena
    if (typeof twilioSignature !== 'string') {
      throw new UnauthorizedException('Firma no válida');
    }


    const authToken = process.env.TWILIO_AUTH_TOKEN || "";
    const url = 'https://your-ngrok-url/webhook';
    const params = body;

    console.log(authToken)

    const isValid = validateRequest(
      authToken,
      twilioSignature,
      url,
      params,
    );

    if (!isValid) {
      throw new UnauthorizedException('Firma no válida');
    }

    console.log('Mensaje recibido de WhatsApp:', body);


    const messageBody = body.Body;
    const fromNumber = body.From;

    console.log(`Mensaje: ${messageBody} | De: ${fromNumber}`);

    res.header('Content-Type', 'text/xml');
    res.send(`
      <Response>
        <Message>¡Hola! Recibimos tu mensaje: "${messageBody}".</Message>
      </Response>
    `);
  }
}
