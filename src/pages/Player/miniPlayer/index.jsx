import React, { useRef } from 'react'
import { getName } from '../../../utils'
import { MiniPlayerContainer } from './style'
import { CSSTransition } from 'react-transition-group'
import ProgressCircle from '../../../UI/ProgressCircle'

function MiniPlayer(props) {
  const { song, fullScreen, playing, percent } = props
  const { toggleFullScreen, togglePlayList, clickPlaying } = props

  const miniPlayerRef = useRef()

  const handleTogglePlayList = (e) => {
    togglePlayList(true)
    e.stopPropagation()
  }

  return (
    <CSSTransition
      in={!fullScreen}
      timeout={400}
      classNames="mini"
      onEnter={() => {
        miniPlayerRef.current.style.display = 'flex'
      }}
      onExited={() => {
        miniPlayerRef.current.style.display = 'none'
      }}
    >
      <MiniPlayerContainer
        ref={miniPlayerRef}
        onClick={() => toggleFullScreen(true)}
      >
        <div className="icon">
          <div className="imgWrapper">
            <img
              className={`play ${playing ? '' : 'pause'}`}
              src={song.al.picUrl}
              width="40"
              height="40"
              alt="img"
            />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control">
          <ProgressCircle radius={32} percent={percent}>
            {playing ? (
              <i
                className="iconfont icon-mini icon-pause"
                onClick={(e) => clickPlaying(e, false)}
              >
                &#xe650;
              </i>
            ) : (
              <i
                className="iconfont icon-mini icon-play"
                onClick={(e) => clickPlaying(e, true)}
              >
                &#xe61e;
              </i>
            )}
          </ProgressCircle>
        </div>
        <div className="control">
          <i className="iconfont" onClick={(e) => handleTogglePlayList(e)}>
            &#xe640;
          </i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  )
}

export default React.memo(MiniPlayer)
