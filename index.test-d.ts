import * as React from 'react'
import YouTube from '.'

{
  React.createElement(YouTube)
}

{
  let onCued = (event: YT.OnStateChangeEvent) => {
    event.data === 5
  }
  React.createElement(YouTube, { onCued })
}

{
  React.createElement(YouTube, { video: 'Mf9oZPwO6js', width: 600, height: '300px' })
}

{
  function onReady ({ target }: YT.PlayerEvent): void {
    target.getIframe()
  }
  React.createElement(YouTube, { showCaptions: true, onReady })
}

{
  React.createElement(YouTube, {
    autoplay: true,
    onReady({ target }) { target.getIframe() }
  })
}
