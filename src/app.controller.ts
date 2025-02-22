import { Controller, Post, Body, Req, Res, UnauthorizedException, Get, Logger } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { validateRequest } from 'twilio/lib/webhooks/webhooks';


@Controller()
export class AppController {

  private readonly logger = new Logger(AppController.name);

  constructor() { }

  @Get()
  test() {
    return "works";
  }


  @Post('webhook')
  handleWhatsAppMessage(
    @Body() body: any,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {

    this.logger.log("request received");
    const twilioSignature = req.headers['x-twilio-signature'];
    this.logger.log("twilioSignature");
    this.logger.log(typeof twilioSignature);

    // Verificar que la firma sea una cadena
    if (typeof twilioSignature !== 'string') {
      this.logger.error("twilioSignature is not a string");
      throw new UnauthorizedException('Firma no válida');

    }


    const authToken = process.env.TWILIO_AUTH_TOKEN || "";
    const url = 'https://chat-bot-production-2494.up.railway.app/webhook';
    const params = body;

    this.logger.log("authToken: ", authToken);
    this.logger.log("body: ", body);

    console.log(authToken)

    const isValid = validateRequest(
      authToken,
      twilioSignature,
      url,
      params,
    );


    if (!isValid) {
      this.logger.error("request no valid");
      throw new UnauthorizedException('Firma no válida');
    }

    this.logger.log('Mensaje recibido de WhatsApp:', body);


    const messageBody = body.Body;
    const fromNumber = body.From;

    this.logger.log(`Mensaje: ${messageBody} | De: ${fromNumber}`);

    res.header('Content-Type', 'text/xml');
    res.send(`
      <Response>
        <Message>¡Hola! Bunkercode ha recibido tu mensaje: "${messageBody}".</Message>
      </Response>
    `);
  }
}
