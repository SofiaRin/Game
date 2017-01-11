var GameScene = (function () {
    function GameScene() {
    }
    var d = __define,c=GameScene,p=c.prototype;
    GameScene.replaceScene = function (scene) {
        GameScene.scene = scene;
        this.commandList = new CommandList();
        GameScene.sceneGrid = new Grid(10, 10);
        GameScene.sceneRoad = new Array();
        GameScene.sceneMap = new TileMap(GameScene.sceneGrid);
    };
    GameScene.setPlayer = function (_player) {
        this.player = _player;
    };
    GameScene.getCurrentScene = function () {
        return GameScene.scene;
    };
    GameScene.needMovetoNpc = function (_endPointX, _endPointY) {
        if (_endPointX / GameScene.TILESIZE != GameScene.player.x / GameScene.TILESIZE &&
            _endPointY / GameScene.TILESIZE != GameScene.player.y / GameScene.TILESIZE) {
            return true;
        }
        else {
            return false;
        }
    };
    GameScene.sceneFindRoad = function (_endPointX, _endPointY) {
        GameScene.sceneGrid.setEndPoint(Math.floor(_endPointX / GameScene.TILESIZE), Math.floor(_endPointY / GameScene.TILESIZE));
        GameScene.sceneGrid.setStartPoint(Math.floor(GameScene.player.x / GameScene.TILESIZE), Math.floor(GameScene.player.y / GameScene.TILESIZE));
        GameScene.sceneRoad = GameScene.sceneMap.findPath();
        if (GameScene.sceneRoad == null) {
            console.log("error tap stay");
            return;
        }
    };
    p.moveTo = function (x, y, callback) {
        console.log("开始移动");
        //isStartJudge = true;
        GameScene.player.move(new Vector2(x, y));
        //moveJudge();
        egret.setTimeout(function () {
            egret.setTimeout(function () {
                if (!GameScene.canMovetoNext) {
                    GameScene.canMovetoNext = true;
                }
            }, this, 3000);
            if (GameScene.canMovetoNext) {
                console.log("结束移动");
                callback();
            }
        }, this, 500);
    };
    p.stopMove = function (callback) {
        console.log("取消移动");
        callback();
    };
    GameScene.TILESIZE = 64;
    return GameScene;
}());
egret.registerClass(GameScene,'GameScene');
//# sourceMappingURL=Sence.js.map