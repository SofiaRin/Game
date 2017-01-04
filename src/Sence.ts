class GameScene {


    private static scene: GameScene;
    public static canMovetoNext:boolean;
    public static player: Player;
    private roadInfo;
    private static TILESIZE = 64;
    public static commandList:CommandList;


    public static replaceScene(scene: GameScene) {
        GameScene.scene = scene;
        this.commandList = new CommandList();
    }

    public static setPlayer(_player: Player) {
        this.player = _player;
    }

    public static getCurrentScene(): GameScene {
        return GameScene.scene;
    }

  

    public moveTo(x: number, y: number, callback: Function) {
        /*
        var index = 1;
        var isStartJudge = false;
        
        function moveJudge() {
            var timeCal = new egret.Timer(1000, 0)
            timeCal.start();
            console.log("Start Judege ?" + isStartJudge);
            timeCal.addEventListener(egret.TimerEvent.TIMER, () => {
                //console.log("call back");
                if (isStartJudge) {
                    console.log("Onposition ? " + GameScene.player._moveState.isOnposition);
                    if (myRoad.length == 1) {
                        console.log("roadLength end stay")
                        return
                    }
                    if (GameScene.player.x == myRoad[index].x * GameScene.TILESIZE + GameScene.TILESIZE / 2
                        && GameScene.player.y == myRoad[index].y * GameScene.TILESIZE + GameScene.TILESIZE / 2) {

                        index++;///// to 0 when is out 
                        GameScene.player.move(new Vector2(myRoad[index].x * GameScene.TILESIZE + GameScene.TILESIZE / 2,
                            myRoad[index].y * GameScene.TILESIZE + GameScene.TILESIZE / 2));
                        console.log("current index " + index);
                        if (index == myRoad.length - 1) {
                            timeCal.removeEventListener(egret.TimerEvent.TIMER, () => { }, this)
                            index = 0;
                            isStartJudge = false;
                        }
                    }


                }
                //console.log("Start Judege ?" + isStartJudge);

            }, this);

        }
         var myRoad = this.roadInfo;
        */
        
       
        console.log("开始移动")
        //isStartJudge = true;
        GameScene.player.move(new Vector2(x,y));
        //moveJudge();
        egret.setTimeout(function () {
            if(GameScene.canMovetoNext){
                console.log("结束移动")
                callback();
            }
        }, this, 500)
        
    }



    public stopMove(callback: Function) {
        console.log("取消移动")
        callback();
    }

}
