/*
 * 1. Render Songs --> OK
 * 2. Scroll top --> OK
 * 3. Play / pause / seek --> OK (fix bug 'seek')
 * 4. CD rotate --> OK  (When Next / Prev CD still rotate --> need fix)
 * 5. Next / prev --> OK
 * 6. Random --> OK
 * 7. Next / Repeat when ended --> OK
 * 8. Active song  
 * 9. Scroll active song into view
 * 10. Play song when click 
 */


const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const repeatBtn = $('.btn-repeat')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const playlist = $('.playlist')

const app = {

    currentIndex: 0,
    isRandom: false,
    isRepeat: false,

    // Name songs
    songs: [
        {
            name: 'Yêu Đương Khó Quá Thì Chạy Về Khóc Với Anh',
            singer: 'Erik',
            path: './assets/music/Song1.mp3',
            image: './assets/image/Image1.jpg',
        },
        {
            name: 'Cưới Thôi',
            singer: 'Masew, Masiu, B Ray, V.A',
            path: './assets/music/Song2.mp3',
            image: './assets/image/Image2.jpg',
        },
        {
            name: 'Đế Vương',
            singer: 'Đình Dũng',
            path: './assets/music/Song3.mp3',
            image: './assets/image/Image3.jpg',
        },
        {
            name: 'Hoa Tàn Tình Tan',
            singer: 'Giang Jolee',
            path: './assets/music/Song4.mp3',
            image: './assets/image/Image4.jpg',
        },
        {
            name: 'Có Em Đây',
            singer: 'Như Việt, Dunghoangpham, ACV',
            path: './assets/music/Song5.mp3',
            image: './assets/image/Image5.jpg',
        },
        {
            name: 'Yêu Đương Khó Quá Thì Chạy Về Khóc Với Anh',
            singer: 'Erik',
            path: './assets/music/Song1.mp3',
            image: './assets/image/Image1.jpg',
        },
        {
            name: 'Cưới Thôi',
            singer: 'Masew, Masiu, B Ray, V.A',
            path: './assets/music/Song2.mp3',
            image: './assets/image/Image2.jpg',
        },
        {
            name: 'Đế Vương',
            singer: 'Đình Dũng',
            path: './assets/music/Song3.mp3',
            image: './assets/image/Image3.jpg',
        },
        {
            name: 'Hoa Tàn Tình Tan',
            singer: 'Giang Jolee',
            path: './assets/music/Song4.mp3',
            image: './assets/image/Image4.jpg',
        },
        {
            name: 'Có Em Đây',
            singer: 'Như Việt, Dunghoangpham, ACV',
            path: './assets/music/Song5.mp3',
            image: './assets/image/Image5.jpg',
        },
    ],

    // Render Songs
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}');"></div>
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

    // HandelEvents
    handleEvents: function () {

        const _this = this

        // Xử lý CD quay

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause()


        // Scroll Top
        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Audio Play / Pause
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi Playing
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi Paused
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                var valuePercentSong = audio.currentTime / audio.duration * 100
                progress.value = valuePercentSong
            }
        }

        // Xử lý khi tua
        progress.onchange = function (e) {
            const seekTime = e.target.value / 100 * audio.duration
            audio.currentTime = seekTime
        }

        // Khi nhấn next Song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandom()
            } else {
                _this.nextSong()
            }
            audio.play()

            _this.render()
        }

        // Khi nhấn prev Song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandom()
            } else {
                _this.prevSong()
            }
            audio.play()

            _this.render()
        }

        // Khi click random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            if (_this.isRepeat) {
                repeatBtn.classList.remove('active')
                _this.isRepeat = false
            }
        }

        // Khi lặp lại bài hát
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
            if (_this.isRandom) {
                randomBtn.classList.remove('active')
                _this.isRandom = false
            }
        }


        // Khi audio ended thì chuyển bài
        audio.onended = function () {
            // Sử dụng lại onclick next Song
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }


        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            // Khi click vào Song & Option
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {

                // Xử lý khi click vào Song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xử lý khi click vào Option

            }
        }

    },

    // Define Property
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },


    // Loading Current Song
    loadCurrentSong: function () {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    // Random Song
    playRandom: function () {
        let newIndex

        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === newIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    // Next Song
    nextSong: function () {
        this.currentIndex++

        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }

        this.loadCurrentSong()
    },

    // Prev Song
    prevSong: function () {
        this.currentIndex--

        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }

        this.loadCurrentSong()
    },


    // Function for Start Run JS
    start: function () {

        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // Lắng nghe / Xử lý các sự kiện DOM
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên khi chạy web
        this.loadCurrentSong()

        // Render List Song
        this.render()
    },

}

// Run JS
app.start()

