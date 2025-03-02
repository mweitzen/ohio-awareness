const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const handler = async (request) => {
  const data = JSON.parse(request.body);

  console.log('Handling request... ', data);

  const msg = {
    to: 'mweitzenhoffer@gmail.com',
    from: 'elliotedward99@gmail.com', // Use the email address or domain you verified above
    subject: 'Exciting News Coming Soon!',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
