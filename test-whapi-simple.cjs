async function testWhapi() {
  const payload = {
    to: '79106000612',
    media: 'https://qbjcdftphxredexkwsui.supabase.co/storage/v1/object/public/checklists/1751882441466_Kak-izbezhat-blokirovki-scheta.pdf',
    caption: 'Test PDF'
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch('https://gate.whapi.cloud/messages/document', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer QlZ00L1DXVAv17SfAoTtarbseCNIKaIo',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', responseText);

    if (!response.ok) {
      console.error('Error:', response.status, responseText);
    } else {
      console.log('Success!');
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

testWhapi(); 