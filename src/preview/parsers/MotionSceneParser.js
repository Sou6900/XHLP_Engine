import { XmlParser } from './XmlParser.js';
import { LogManager } from '../core/LogManager.js';

export class MotionSceneParser {
    constructor() {
        this.parser = new XmlParser();
    }

    parse(xmlContent) {
        const TAG = 'MotionSceneParser';
        LogManager.d(TAG, 'Parsing MotionScene XML content...');

        const ast = this.parser.parse(xmlContent);
        if (!ast || ast.type !== 'MotionScene') {
            const errorMsg = `Invalid root tag. Expected "MotionScene", got: ${ast?.type}`;
            console.error('❌ [MotionSceneParser]', errorMsg);
            LogManager.e(TAG, errorMsg);
            return null;
        }

        const scene = {
            transitions: [],
            constraintSets: {}
        };

        // console.group('[MotionSceneParser] Parsing Scene...');
        LogManager.i(TAG, 'Valid MotionScene root found. Processing children...');

        ast.children.forEach(child => {
            const getAttr = (name) => child.attributes[name] || child.attributes[`android:${name}`] || child.attributes[`app:${name}`];

            if (child.type === 'Transition') {
                const startId = this._getId(getAttr('constraintSetStart'));
                const endId = this._getId(getAttr('constraintSetEnd'));
                const duration = parseInt(getAttr('duration') || '300');

                // console.log(`   Transition found: ${startId} -> ${endId} (${duration}ms)`);
                LogManager.v(TAG, `Transition detected: ${startId} -> ${endId} (Duration: ${duration}ms)`);

                const t = {
                    start: startId,
                    end: endId,
                    duration: duration,
                    onClick: null
                };

                // Check for OnClick
                const onClickNode = child.children.find(c => c.type === 'OnClick');
                if (onClickNode) {
                    const clickAttr = (name) => onClickNode.attributes[name] || onClickNode.attributes[`android:${name}`] || onClickNode.attributes[`app:${name}`];
                    const targetId = this._getId(clickAttr('targetId'));
                    
                    // console.log(`       OnClick Handler found for target: ${targetId}`);
                    LogManager.v(TAG, `OnClick handler attached to: ${targetId}`);
                    
                    t.onClick = {
                        targetId: targetId,
                        action: clickAttr('clickAction')
                    };
                }
                scene.transitions.push(t);
            } 
            else if (child.type === 'ConstraintSet') {
                const setIdAttr = child.attributes['android:id'] || child.attributes['id'];
                const setId = this._getId(setIdAttr);
                // console.log(`   ConstraintSet found: ${setId}`);
                LogManager.v(TAG, `ConstraintSet defined: ${setId}`);
                scene.constraintSets[setId] = this._parseConstraintSet(child);
            }
        });

        console.groupEnd();
        LogManager.i(TAG, `Parsing complete. Found ${scene.transitions.length} transitions and ${Object.keys(scene.constraintSets).length} constraint sets.`);
        return scene;
    }

    _parseConstraintSet(node) {
        const constraints = {}; // Map<ViewID, Attributes>
        
        node.children.forEach(child => {
            if (child.type === 'Constraint') {
                const idAttr = child.attributes['android:id'] || child.attributes['id'];
                const viewId = this._getId(idAttr);
                
                if (viewId) {
                    constraints[viewId] = { ...child.attributes };
                }
            }
        });
        return constraints;
    }

    _getId(raw) {
        return raw ? raw.replace('@+id/', '').replace('@id/', '') : null;
    }
}