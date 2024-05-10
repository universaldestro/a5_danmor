const { createApp } = Vue

createApp({
  data() {
    return {
      all:{state: true,  variant:'btn btn-success'},
      drop:['dropdown-item active','dropdown-item','dropdown-item'],
      Dflag: 1,
      Tflag: 2,
      numSongs: 0,
      query:'',
      artist1: './img/1.jpg',
      artist2: './img/2.jpg',
      origin: [],
      sortedItems:[],
      items:[],
      tags:[],
      genresChosen:{}
    }
  },
  methods: {
    Switchtab:function(e,flag){

      if(flag === 2){
        this.items[e].TrackInfo = false;
      }
      else {
        this.items[e].TrackInfo = true;
      }
    },
    Search:function(){
      const defaultApi = 'https://itunes.apple.com/search?term='+encodeURIComponent(this.query.replace(' ','+'))+'&limit=50&attribute=allArtistTerm';
      fetch(defaultApi)
      .then(response =>{return response.json();})
      .then(songs =>{console.log(songs);
      this.numSongs = songs.resultCount;
        if (this.numSongs == 0){
          alert("No artist was found with" + this.query);
        }
      const tempTags = {};
      for (let i = 0; i < songs.resultCount; i++){
        songs.results[i].TrackInfo = true;
        songs.results[i].place = i;
        tempTags[songs.results[i].primaryGenreName]= true;
        songs.results[i].audPlay = this.$refs[songs.results[i].trackId];
        songs.results[i].audState = 'Play';

        if(!(Object.hasOwn(songs.results[i], 'collectionPrice'))){
          songs.results[i].collectionPrice = 0;
        }
        for (let x in songs.results[i]){
          if (songs.results[i][x] == ''){
            songs.results[i][x] ="No information provided"
          }
        }
      }
      this.tags = [];
      for (let x in tempTags){
        this.tags.push({ caption: x, state: false, variant: 'btn btn-default' });

      }
      this.origin = JSON.parse(JSON.stringify(songs.results));
      this.items = JSON.parse(JSON.stringify(songs.results));
      this.sortedItems = JSON.parse(JSON.stringify(songs.results));
      this.ToggleAll();
      this.SortItems(0);
      });
    },
    
    Togglebutton:function(i){

      if(this.tags[i].state){
        this.tags[i].variant =  'btn btn-default';
        this.tags[i].state = false;
        delete this.genresChosen[this.tags[i].caption];
      } else{
        this.tags[i].variant =  'btn btn-primary';
        this.tags[i].state = true;
        this.genresChosen[this.tags[i].caption] = true;
        this.all.state = false;
        this.all.variant = 'btn btn-default';
      }
      this.FilterGenres();
    },

    FilterGenres:function(){
      
      if(Object.keys(this.genresChosen).length === 0) {
        this.ToggleAll();
      }
      else{

        let newList = [];
        
        for(let item in this.sortedItems){
          item =  this.sortedItems[item];
          if(Object.hasOwn(this.genresChosen,item.primaryGenreName)){
            newList.push(item);
          
          }
        }


        
        this.items = newList;
        this.numSongs = this.items.length;
      }
      
    },

    ToggleAll:function(){
      this.all.state = true;
      this.all.variant = 'btn btn-success';
      this.items = JSON.parse(JSON.stringify(this.sortedItems));
      this.genresChosen = {};
     
      for( let x in this.tags){
        this.tags[x].variant = 'btn btn-default'; 
        this.tags[x].state = false;
      }
      this.numSongs = this.items.length;
      //union set
    },

    SortItems:function(e){
      if(e === 0){
        this.items.sort(this.CompareOrigin);
        this.sortedItems.sort(this.CompareOrigin);
        //this.items = JSON.parse(JSON.stringify(this.origin));
        //this.sortedItems = JSON.parse(JSON.stringify(this.origin));
        this.drop[0] = 'dropdown-item active';
        this.drop[1] = 'dropdown-item';
        this.drop[2] = 'dropdown-item';
      }
      else if( e === 1){
        this.items.sort(this.CompareCollectionNames);
        this.sortedItems.sort(this.CompareCollectionNames);
        this.drop[0] = 'dropdown-item';
        this.drop[1] = 'dropdown-item active';
        this.drop[2] = 'dropdown-item';

      }
      else{

        console.log(this.items);
        
        

        this.items.sort(this.ComparePrices);
        console.log(this.items);
        this.sortedItems.sort(this.ComparePrices);
        this.drop[0] = 'dropdown-item';
        this.drop[1] = 'dropdown-item';
        this.drop[2] = 'dropdown-item active';
      }

      
   },

   ComparePrices:function(a,b){
    return a.collectionPrice - b.collectionPrice;
   },
   CompareCollectionNames:function(a, b) {
  if (a.collectionName < b.collectionName) {
    return -1;
  } else if (a.collectionName > b.collectionName) {
    return 1;
  }
 
  return 0;
   },
   CompareOrigin:function(a, b){
    return a.place - b.place;
   },
   PlayAudio:function(e){

    if(this.items[e].audState === 'Play'){
      this.items[e].audPlay.play();
      this.items[e].audState = 'Stop';
    }
    else{
      this.items[e].audPlay.pause();
      this.items[e].audState = 'Play';
    }    
    
   }

  }
}).mount('#app')
//  <audio :ref="item.trackId" :src="item.previewUrl"></audio>

                              //<button class="btn btn-default" @click="PlayAudio(index)" >{{item.audState}}</button>