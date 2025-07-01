module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://script.marquiz.ru https://yandex.ru; connect-src *; img-src * blob: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src https://quiz.marquiz.ru https://yandex.ru;`.replace(/\n/g, ""),
          },
        ],
      },
    ]
  },
} 