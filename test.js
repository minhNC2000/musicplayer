const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const PLAYER_STORAGE_KEY = 'MINH_PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const preBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    // config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [{
            name: 'Đám cưới nha',
            singer: 'Hồng Thanh & DJ Mie',
            image: 'https://data.chiasenhac.com/data/cover/158/157878.jpg',
            path: 'https://data.nhacpro.me/download/f5dc9af21f59ad377c3c8d8f76d1018e.mp3?filename=Dam%20Cuoi%20Nha%20Nhac%20Chuong%20-%20Hong%20Thanh%20DJ%20Mie&time=1650428406'
        },
        {
            name: 'Yêu Đương Khó Quá Thì Chạy Về Khóc Với Anh',
            singer: 'Erik',
            image: 'https://data.chiasenhac.com/data/cover/155/154074.jpg',
            path: 'https://data.chiasenhac.com/down2/2221/3/2220891-72ab7211/flac/Chay%20Ve%20Khoc%20Voi%20Anh%20-%20ERIK%20(NhacPro.net).flac?time=1650428452'
        },
        {
            name: 'Tìm Lại Bầu Trời ',
            singer: 'Tuấn Hưng',
            image: 'https://data.chiasenhac.com/data/cover/2/1592.jpg',
            path: 'https://data51.chiasenhac.com/downloads/1002/3/1001372-9f61541c/flac/Tim%20Lai%20Bau%20Troi%20-%20Tuan%20Hung%20(NhacPro.net).flac?time=1650428481'
        },
        {
            name: 'Chiếc khăn gió ấm',
            singer: 'Khánh Phương',
            image: 'https://data.chiasenhac.com/data/cover/52/51739.jpg',
            path: 'https://data34.chiasenhac.com/downloads/1948/3/1947842-bbd6b55b/flac/Chiec%20Khan%20Gio%20Am%20-%20Khanh%20Phuong%20(NhacPro.net).flac?time=1650428546'
        },
        {
            name: 'Ngày Đầu Tiên',
            singer: 'Đức Phúc',
            image: 'https://data.nhacpro.me/resize/140/data/avatar/79548713660947764621c30872a49b00.jpg?v=9cfe1os',
            path: 'https://data.chiasenhac.com/down2/2224/3/2223570-77fd7172/flac/Ngay%20Dau%20Tien%20-%20Duc%20Phuc%20(NhacPro.net).flac?time=1650428595'
        },
        {
            name: 'Va Vào Giai Điệu Này',
            singer: 'RPT MCK',
            image: 'https://data.nhacpro.me/resize/140/data/avatar/272c3c5dcba22d3d803edf8c93acedd2.jpg?v=9bm1xke',
            path: 'https://data3.chiasenhac.com/downloads/2129/3/2128963-49670d82/flac/Va%20Vao%20Giai%20Dieu%20Nay%20-%20RAP%20VIET%20MCK%20(NhacPro.net).flac?time=1650428720'
        }
    ],


    // setConfig: function(key, value) {
    //     this.config[key] = value;
    //     localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config))
    // },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return ` 
          <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
          <div class="thumb" style="background-image: url('${song.image}')">
          </div>
          <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
          </div>
          <div class="option">
              <i class="fas fa-ellipsis-h"></i>
          </div>
      </div> 
          `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })

    },
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }

        ], {
            duration: 10000,
            iteration: Infinity
        })
        cdThumbAnimate.pause()

        document.onscroll = function() {
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newCdWidth = cdWidth - scrollTop
                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
                cd.style.opacity = newCdWidth / cdWidth
            }
            // Xử lí khi click play
        playBtn.onclick = function() {
                if (_this.isPlaying) {
                    audio.pause()
                } else {
                    audio.play()
                }
            }
            // Play 
        audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            // Pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        audio.ontimeupdate = function() {

            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }

        }

        // Xử lý khi tua bài hát
        progress.onchange = function(e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }
            // Xử lý next bài hát
        nextBtn.onclick = function() {

                if (_this.isRandom) {
                    _this.playRandomSong()
                } else {
                    _this.nextSong()
                }

                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }
            // Xử lý về bài hát trước đó
        preBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.preSong()
            }

            audio.play()
            _this.render()
        }

        // Xử lý on/off random bài hát
        randomBtn.onclick = function(e) {
                _this.isRandom = !_this.isRandom
                    // _this.setConfig('isRandom', _this.isRandom)
                randomBtn.classList.toggle('active', _this.isRandom)
            }
            //Xử lí lặp lại bài hát
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
                // _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }

        }

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active) ')
            if (songNode || e.target.closest('.song:not(.active) ') || e.target.closest('.option')) {

                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    // loadConfig: function() {
    //     this.isRandom = this.config.isRandom
    //     this.isRepeat = this.config.isRepeat
    // },
    nextSong: function() {
        this.currentIndex++
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
        this.loadCurrentSong()
    },
    preSong: function() {
        this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()

    },



    start: function() {
        //gán  cấu hình từ config vào App
        // this.loadConfig()


        // định nghĩa các thuộc tính  cho object

        this.defineProperties()

        // Lắng nghe / xử lý các sự kiện DOM
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }
}


app.start()