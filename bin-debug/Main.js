//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.initTaskSystem = function (stageH, stageW) {
        var task02 = new Task("002", "Kill 4 pigs", "Tap button", "npc_1", "npc_1", TaskStatus.UNACCEPTABLE, new KillMonsterTaskCondition("B27"), 4, null);
        var task01 = new Task("001", "Welcome to the World of Warcraft", "Click the whiteMan", "npc_0", "npc_1", TaskStatus.ACCEPTABLE, new NPCTalkTaskCondition(), 1, task02);
        var monster_0 = new KillMonsterButton("B27");
        this.addChild(monster_0);
        monster_0.scaleX = 0.5;
        monster_0.scaleY = 0.5;
        monster_0.x = stageW / 2;
        monster_0.y = stageH / 4;
        TaskService.getInstance().addTask(task01);
        TaskService.getInstance().addTask(task02);
        var missionPanel = new TaskPanel();
        this.addChild(missionPanel);
        var npc_0 = new NPC("npc_0");
        this.addChild(npc_0);
        npc_0.scaleX = 0.5;
        npc_0.scaleY = 0.5;
        npc_0.x = stageW / 4;
        npc_0.y = stageH / 2;
        var npc_1 = new NPC("npc_1");
        this.addChild(npc_1);
        npc_1.scaleX = 0.5;
        npc_1.scaleY = 0.5;
        npc_1.x = stageW / 2.5;
        npc_1.y = stageH / 4;
        TaskService.getInstance().addObserver(npc_0);
        TaskService.getInstance().addObserver(npc_1);
        TaskService.getInstance().addObserver(missionPanel);
        npc_0.initNpcTask(npc_0);
        npc_1.initNpcTask(npc_1);
        //missionPanel.initTaskPanel(missionPanel);
        var updateTaskPanel = new egret.Timer(500, 0);
        updateTaskPanel.start();
        updateTaskPanel.addEventListener(egret.TimerEvent.TIMER, function () {
            missionPanel.initTaskPanel(missionPanel);
        }, this);
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var myGrid = new Grid(10, 10);
        var myRoad = new Array();
        var myMap = new TileMap(myGrid);
        this.addChild(myMap);
        var player = new Player();
        this.addChild(player);
        player.x = 32;
        player.y = 32;
        this.touchEnabled = true;
        var index = 0;
        var isStartJudge = false;
        function moveJudge() {
            var _this = this;
            var timeCal = new egret.Timer(1000, 0);
            timeCal.start();
            console.log("Start Judege ?" + isStartJudge);
            timeCal.addEventListener(egret.TimerEvent.TIMER, function () {
                //console.log("call back");
                if (isStartJudge) {
                    console.log("Onposition ? " + player._moveState.isOnposition);
                    if (myRoad.length == 1) {
                        console.log("roadLength end stay");
                        return;
                    }
                    if (player.x == myRoad[index].x * Main.TILESIZE + Main.TILESIZE / 2 && player.y == myRoad[index].y * Main.TILESIZE + Main.TILESIZE / 2) {
                        index++; ///// to 0 when is out 
                        player.move(new Vector2(myRoad[index].x * Main.TILESIZE + Main.TILESIZE / 2, myRoad[index].y * Main.TILESIZE + Main.TILESIZE / 2));
                        console.log("current index " + index);
                        if (index == myRoad.length - 1) {
                            timeCal.removeEventListener(egret.TimerEvent.TIMER, function () { }, _this);
                            index = 0;
                            isStartJudge = false;
                        }
                    }
                }
                console.log("Start Judege ?" + isStartJudge);
            }, this);
        }
        /*
                function moveJudge2() {
        
                    egret.Ticker.getInstance().register(() => {
        
                        if (player._moveState.isOnposition) {
                            index++;///// to 0 when is out
                            console.log("current index " + index);
                        }
        
                    }, this);
                }
        */
        //this.stage
        myMap.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            console.log("tap_px " + e.stageX + "," + e.stageY);
            myMap.grid.setEndPoint(Math.floor(e.stageX / Main.TILESIZE), Math.floor(e.stageY / Main.TILESIZE));
            myMap.grid.setStartPoint(Math.floor(player.x / Main.TILESIZE), Math.floor(player.y / Main.TILESIZE));
            myRoad = myMap.findPath();
            /*
            var targetX = myRoad[index].x * 64 + 64 / 2;
            var targetY = myRoad[index].y * 64 + 64 / 2;

            var dx = targetX - player.x;
            var dy = targetY - player.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
*/
            if (myRoad == null) {
                console.log("error tip stay");
                return;
            }
            isStartJudge = true;
            player.move(new Vector2(myRoad[index].x * Main.TILESIZE + Main.TILESIZE / 2, myRoad[index].y * Main.TILESIZE + Main.TILESIZE / 2));
            moveJudge();
            /*
                                   if (dist < 1) {
                                       index++;
                                       if (index = myRoad.length) {
                                           this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => { }, this);
                                       }
                                       player.x == myRoad[index].x * 64 + 64 / 2 && player.y == myRoad[index].y * 64 + 64 / 2
            */
        }, this);
        this.initTaskSystem(this.stage.stageWidth, this.stage.stageHeight);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    Main.TILESIZE = 64;
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map