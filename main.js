const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,  
    songs: [
        {
            name: 'Vì anh đâu có biết',
            singer: 'Madihu, Vũ',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: '2AM',
            singer: 'Justatee, Big Dady',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Thức giấc',
            singer: 'Dalab',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Bước qua mùa cô đơn',
            singer: 'Vũ',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Chuyện đôi ta',
            singer: 'Emcee L',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Lạ lùng',
            singer: 'Vũ',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Bước qua nhau',
            singer: 'Vũ',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'SAY  ',
            singer: 'Lena { ft T.R.I }',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'QUERRY',
            singer: 'QNT x TRUNG TRẦN ft RPT MCK',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
    ],
    render: function(){
        const htmls = this.songs.map((song, index) => {
        
       
            return `
            <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
           `;
        });

        playlist.innerHTML = htmls.join("");

    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){ 
                return this.songs[this.currentIndex];
            }
            });
        
    },

    handleEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // quay CD

        const cdThumbAnimate =  cdThumb.animate([
            { transform: 'rotate(3600deg)'}
        ], {
                duration: 200000,
                interations: Infinity, 
                
               
                
            })
            cdThumbAnimate.pause()
        
        // Xu ly phong to thu nho CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newcdWidth = cdWidth - scrollTop

            cd.style.width = newcdWidth> 0 ? newcdWidth + "px" : 0
            cd.style.opacity = newcdWidth/cdWidth

        }
        // Xu li khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying){        
                audio.pause()
            }else{ 
                audio.play()
            }
           
        }
        // khi song duoc play va pause
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
           

        }
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }
        // Khi thoi gian bai hat thay doi
        audio.ontimeupdate = function(){
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent

            }
        }

        // Khi tua bai hat
            progress.oninput = function(e){
              const seekTime = audio.duration / 100 * e.target.value
              audio.currentTime = seekTime 
            }

        // khi tua tung bai hat
        nextBtn.onclick = function(){   
            if(_this.isRandom){
                _this.playRamdomSong()
            } else {
            _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        prevBtn.onclick = function(){  
            if(_this.isRandom){
                _this.playRamdomSong()
            } else {
                _this.prevSong()
            } 
            
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Random bai hat
        randomBtn.onclick = function(e){
            randomBtn.classList.add("active")
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
          
        }
        // lap lai 1 bai hat 
        repeatBtn.onclick = function(e){
            repeatBtn.classList.add("active")
           
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
          
        }

        // xu ly next song khi audio ended
            audio.onended = function(){
                if(_this.isRepeat){
                    audio.play()
                } else {
                nextBtn.click()
                }
            }
            // An vao de nghe bai hat
            playlist.onclick = function(e){
                // xu ly khi click vao
                const songNode = e.target.closest('.song:not(.active)');
                if(
                    songNode ||
                    e.target.closest('.option')
                ){   //xu ly khi clixk vao xong
                    if(songNode){
                        _this.currentIndex = Number(songNode.dataset.index)
                        _this.loadCurrentSong()
                        audio.play()
                        _this.render()

                    }
                    // xu ly khi click vao song options
                    if(e.target.closest('.option')){

                    }
                }

            }

    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },

    playRamdomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex == this.currentIndex);

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    scrollToActiveSong() {
        let _this = this;
        // let checkIndex = _this.currentIndex < 2 ? "start" : "nearest";
        setTimeout(() => {
        //   console.log("croll");
          $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: _this.currentIndex < 2 ? "end" : "center",
          });
        }, 1000);
      },

    loadCurrentSong: function(){
       

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image} ')` 
        audio.src = this.currentSong.path

    },
    


    start: function(){
        
        // Dinh nghia cac thuoc tinh cho Object
        this.defineProperties()
        // Lang nghe/ Xu li cac su kien(DOM event)
        this.handleEvents()
        // Tai thon gtin bai hat dau tien vao UI khi chay
        this.loadCurrentSong()
        // render playlist
        this.render()
    },

    

};

app.start();

 
    
