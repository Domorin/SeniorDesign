﻿import { Player } from "./Player";

export class ChargeMeter implements IUpdatable, IRenderable {    

    constructor(player : Player) {
        this.player = player;
    }

    RECT_WIDTH: number = 7;


    maxPower: boolean = false;
    polygon: Phaser.Polygon;
    pointer: Phaser.Pointer;
    player: Player;

    update(scene: GameScene) {


        if (this.player.beingDragged) {
            // Calculate distance between player and pointer
            var dragDistance = Math.sqrt((this.pointer.y - this.player.sprite.body.center.y) ** 2 + (this.pointer.x - this.player.sprite.body.center.x) ** 2);
            // Ensure distance is no greater than MAX_DRAG_DISTANCE
            if (dragDistance > this.player.MAX_DRAG_DISTANCE) {
                dragDistance = this.player.MAX_DRAG_DISTANCE;
                this.maxPower = true;
            } else {
                this.maxPower = false
            }

            // Get angle between the center of the player and the pointer
            var angle = -Math.atan2(this.pointer.y - this.player.sprite.body.center.y, this.pointer.x - this.player.sprite.body.center.x) + Math.PI;

            // Calculate and set the polygon points for the launch meter
            this.calculatePolygonPoints(dragDistance, angle);

            // Input was released, launch the player!
            if (this.pointer.isUp) {

                // This should not be set here
                this.player.beingDragged = false;

                // Set velocity of the player according to the angle and distance
                var speed = dragDistance * this.player.VELOCITY_MODIFIER
                var xVel = speed * Math.cos(angle);
                var yVel = -speed * Math.sin(angle);

                this.player.sprite.body.velocity.setTo(xVel, yVel);
            }
        }
    }

    calculatePolygonPoints(dragDistance, angle) {
        var startPointX = this.player.sprite.body.center.x + dragDistance * -Math.cos(angle);
        var startPointY = this.player.sprite.body.center.y + dragDistance * Math.sin(angle);

        var pointAngle = angle - Math.PI / 2

        var p1 = new Phaser.Point(this.player.sprite.body.center.x - this.RECT_WIDTH * Math.cos(pointAngle), this.player.sprite.body.center.y + this.RECT_WIDTH * Math.sin(pointAngle));
        var p2 = new Phaser.Point(this.player.sprite.body.center.x + this.RECT_WIDTH * Math.cos(pointAngle), this.player.sprite.body.center.y - this.RECT_WIDTH * Math.sin(pointAngle));

        var p3 = new Phaser.Point(startPointX - this.RECT_WIDTH * Math.cos(pointAngle), startPointY + this.RECT_WIDTH * Math.sin(pointAngle));
        var p4 = new Phaser.Point(startPointX + this.RECT_WIDTH * Math.cos(pointAngle), startPointY - this.RECT_WIDTH * Math.sin(pointAngle));

        this.polygon.setTo([p1, p2, p4, p3])
    }


    render(graphics: Phaser.Graphics) {
        if (this.player.beingDragged) {
            if (this.player.chargeMeter.maxPower) {
                // Seizure warning				
                graphics.beginFill((Math.random() * 0xFFFFFF));
            } else {
                graphics.beginFill(0xFF0000);
            }
            graphics.drawPolygon(this.polygon.points);
            graphics.endFill();
        }
    }
}