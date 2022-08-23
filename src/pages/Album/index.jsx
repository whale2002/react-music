import React, { useState, useRef, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

import { Container, TopDesc, Menu } from './style'
import Header from './../../UI/Header'
import Scroll from '../../UI/Scroll'
import Loading from '../../UI/Loading'
import SongsList from '../../components/SongsList'
import { isEmptyObject } from '../../utils'
import style from '../../assets/style/global'
import { getAlbumList, changeEnterLoading } from './store/actionCreators'
export const HEADER_HEIGHT = 45

function Album(props) {
  const [showStatus, setShowStatus] = useState(true)
  const [title, setTitle] = useState('歌单')
  const [isMarquee, setIsMarquee] = useState(false)
  const id = props.match.params.id
  const headerEl = useRef()

  const { currentAlbum: currentAlbumImmutable, enterLoading } = props
  const { getAlbumDataDispatch } = props
  let currentAlbum = currentAlbumImmutable.toJS()

  useEffect(() => {
    getAlbumDataDispatch(id)
  }, [getAlbumDataDispatch, id])

  const handleBack = useCallback(() => {
    setShowStatus(false)
  }, [])
  const handleScroll = useCallback(
    (pos) => {
      let minScrollY = -HEADER_HEIGHT
      let percent = Math.abs(pos.y / minScrollY)
      let headerDom = headerEl.current
      // 滑过顶部的高度开始变化
      if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = style['theme-color']
        headerDom.style.opacity = Math.min(1, (percent - 1) / 2)
        setTitle(currentAlbum.name)
        setIsMarquee(true)
      } else {
        headerDom.style.backgroundColor = ''
        headerDom.style.opacity = 1
        setTitle('歌单')
        setIsMarquee(false)
      }
    },
    [currentAlbum]
  )

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">
              {Math.floor(currentAlbum.subscribedCount / 1000) / 10} 万{' '}
            </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    )
  }
  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    )
  }

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container>
        <Header
          title={title}
          handleClick={handleBack}
          isMarquee={isMarquee}
          ref={headerEl}
        ></Header>
        {!isEmptyObject(currentAlbum) ? (
          <Scroll onScroll={handleScroll} bounceTop={false}>
            <div>
              {renderTopDesc()}
              {renderMenu()}
              <SongsList
                songs={currentAlbum.tracks}
                collectCount={currentAlbum.subscribedCount}
                showCollect={true}
                showBackground={true}
              ></SongsList>
            </div>
          </Scroll>
        ) : null}
        {enterLoading ? <Loading></Loading> : null}
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading'])
})
const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true))
      dispatch(getAlbumList(id))
    }
  }
}
// HOC
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album))
