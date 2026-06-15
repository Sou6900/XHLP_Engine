// ToolbarData.js

export class ToolbarData {
    /**
     * Build comprehensive inspector data from solver state
     * @param {string} viewId - The view ID to inspect
     * @param {object} solverState - The solver state containing view info
     * @returns {object} - Complete data object for sidebar
     */
    static buildInspectorData(viewId, solverState) {
        if (!viewId || !solverState) return null;

        const state = solverState.viewStates?.[viewId];
        if (!state) return null;

        const viewType = state.node?.type || 'View';
        
        // Helper to get attributes
        const getAttr = (key) => {
            const attrs = state.node?.attributes || {};
            return attrs[key] || attrs[`android:${key}`] || attrs[`app:${key}`];
        };

        const data = {
            // Basic Info
            id: viewId,
            viewType: viewType,
            className: viewType.split('.').pop() || viewType,

            // Layout Dimensions
            layout: {
                width: getAttr('layout_width') || 'wrap_content',
                height: getAttr('layout_height') || 'wrap_content',
                widthMode: state.w_mode || getAttr('layout_width') || 'wrap_content',
                heightMode: state.h_mode || getAttr('layout_height') || 'wrap_content'
            },

            // Computed Position & Size
            computed: {
                x: state.x || 0,
                y: state.y || 0,
                width: state.w || 0,
                height: state.h || 0,
                absoluteX: state.absoluteX || state.x || 0,
                absoluteY: state.absoluteY || state.y || 0
            },

            // ConstraintLayout Constraints
            constraints: this.extractConstraints(getAttr, state),

            // Padding & Margin
            spacing: {
                padding: getAttr('padding') || '0dp',
                paddingStart: getAttr('paddingStart') || getAttr('paddingLeft'),
                paddingEnd: getAttr('paddingEnd') || getAttr('paddingRight'),
                paddingTop: getAttr('paddingTop'),
                paddingBottom: getAttr('paddingBottom'),
                paddingHorizontal: getAttr('paddingHorizontal'),
                paddingVertical: getAttr('paddingVertical'),
                
                margin: getAttr('layout_margin') || '0dp',
                marginStart: getAttr('layout_marginStart') || getAttr('layout_marginLeft'),
                marginEnd: getAttr('layout_marginEnd') || getAttr('layout_marginRight'),
                marginTop: getAttr('layout_marginTop'),
                marginBottom: getAttr('layout_marginBottom'),
                marginHorizontal: getAttr('layout_marginHorizontal'),
                marginVertical: getAttr('layout_marginVertical')
            },

            // Appearance & Transforms
            appearance: {
                visibility: getAttr('visibility') || 'visible',
                alpha: getAttr('alpha') || '1.0',
                elevation: getAttr('elevation') || '0dp',
                background: getAttr('background'),
                backgroundTint: getAttr('backgroundTint'),
                foreground: getAttr('foreground'),
                
                // Transforms
                rotation: getAttr('rotation') || '0',
                rotationX: getAttr('rotationX'),
                rotationY: getAttr('rotationY'),
                scaleX: getAttr('scaleX') || '1',
                scaleY: getAttr('scaleY') || '1',
                translationX: getAttr('translationX') || '0',
                translationY: getAttr('translationY') || '0',
                translationZ: getAttr('translationZ') || '0',
                pivotX: getAttr('pivotX'),
                pivotY: getAttr('pivotY')
            },

            // Interaction
            interaction: {
                clickable: getAttr('clickable'),
                focusable: getAttr('focusable'),
                enabled: getAttr('enabled'),
                longClickable: getAttr('longClickable'),
                contextClickable: getAttr('contextClickable')
            },

            // Specific Properties (View-type specific)
            attributes: {},
            
            //️ Helper Flags
            flags: {
                isGuideline: !!state.isGuideline,
                isBarrier: !!state.node?.type?.includes('Barrier'),
                isFlow: !!state.node?.type?.includes('Flow'),
                isGone: !!state.isGone,
                isHelper: !!(state.isGuideline || state.node?.type?.includes('Barrier') || state.node?.type?.includes('Flow'))
            }
        };

        // Inject view-specific attributes
        this.injectSpecificAttributes(data, viewType, getAttr, state);

        return data;
    }

    /**
     * Extract constraint relationships
     */
    static extractConstraints(getAttr, state) {
        return {
            // Horizontal
            startToStart: getAttr('layout_constraintStart_toStartOf'),
            startToEnd: getAttr('layout_constraintStart_toEndOf'),
            endToEnd: getAttr('layout_constraintEnd_toEndOf'),
            endToStart: getAttr('layout_constraintEnd_toStartOf'),
            
            // Vertical
            topToTop: getAttr('layout_constraintTop_toTopOf'),
            topToBottom: getAttr('layout_constraintTop_toBottomOf'),
            bottomToBottom: getAttr('layout_constraintBottom_toBottomOf'),
            bottomToTop: getAttr('layout_constraintBottom_toTopOf'),
            
            // Baseline
            baselineToBaseline: getAttr('layout_constraintBaseline_toBaselineOf'),
            
            // Bias
            horizontalBias: getAttr('layout_constraintHorizontal_bias') || '0.5',
            verticalBias: getAttr('layout_constraintVertical_bias') || '0.5',
            
            // Chains
            horizontalChainStyle: getAttr('layout_constraintHorizontal_chainStyle'),
            verticalChainStyle: getAttr('layout_constraintVertical_chainStyle'),
            horizontalWeight: getAttr('layout_constraintHorizontal_weight'),
            verticalWeight: getAttr('layout_constraintVertical_weight'),
            
            // Dimension Ratio
            dimensionRatio: getAttr('layout_constraintDimensionRatio'),
            
            // GoneMargin
            goneMarginStart: getAttr('layout_goneMarginStart'),
            goneMarginEnd: getAttr('layout_goneMarginEnd'),
            goneMarginTop: getAttr('layout_goneMarginTop'),
            goneMarginBottom: getAttr('layout_goneMarginBottom'),
            
            // Circular
            circleConstraint: getAttr('layout_constraintCircle'),
            circleRadius: getAttr('layout_constraintCircleRadius'),
            circleAngle: getAttr('layout_constraintCircleAngle'),
            
            // Chain Detection (from state)
            inHorizontalChain: state.inHorizontalChain,
            inVerticalChain: state.inVerticalChain
        };
    }

    /**
     * Inject view-specific attributes based on type
     */
    static injectSpecificAttributes(data, viewType, getAttr, state) {
        // TextView / Button / EditText
        if (viewType.includes('Text') || viewType.includes('Button') || viewType === 'EditText') {
            data.attributes.text = {
                text: getAttr('text'),
                textSize: getAttr('textSize') || '14sp',
                textColor: getAttr('textColor'),
                textStyle: getAttr('textStyle') || 'normal',
                fontFamily: getAttr('fontFamily'),
                typeface: getAttr('typeface'),
                gravity: getAttr('gravity') || 'top|start',
                textAlignment: getAttr('textAlignment'),
                lines: getAttr('lines'),
                maxLines: getAttr('maxLines'),
                minLines: getAttr('minLines'),
                ellipsize: getAttr('ellipsize'),
                letterSpacing: getAttr('letterSpacing'),
                lineSpacingExtra: getAttr('lineSpacingExtra'),
                lineSpacingMultiplier: getAttr('lineSpacingMultiplier'),
                textAllCaps: getAttr('textAllCaps'),
                hint: getAttr('hint'),
                textColorHint: getAttr('textColorHint'),
                inputType: getAttr('inputType'),
                imeOptions: getAttr('imeOptions'),
                drawableStart: getAttr('drawableStart'),
                drawableEnd: getAttr('drawableEnd'),
                drawableTop: getAttr('drawableTop'),
                drawableBottom: getAttr('drawableBottom'),
                drawablePadding: getAttr('drawablePadding'),
                drawableTint: getAttr('drawableTint')
            };
        }

        //️ ImageView
        if (viewType.includes('Image')) {
            data.attributes.image = {
                src: getAttr('src'),
                scaleType: getAttr('scaleType') || 'fitCenter',
                tint: getAttr('tint'),
                tintMode: getAttr('tintMode'),
                adjustViewBounds: getAttr('adjustViewBounds'),
                cropToPadding: getAttr('cropToPadding'),
                baseline: getAttr('baseline'),
                baselineAlignBottom: getAttr('baselineAlignBottom')
            };
        }

        // Guideline
        if (state.isGuideline) {
            data.attributes.guideline = {
                orientation: getAttr('orientation'),
                percent: getAttr('layout_constraintGuide_percent'),
                begin: getAttr('layout_constraintGuide_begin'),
                end: getAttr('layout_constraintGuide_end')
            };
        }

        // Barrier
        if (data.flags.isBarrier) {
            data.attributes.barrier = {
                direction: getAttr('barrierDirection'),
                referencedIds: getAttr('constraint_referenced_ids'),
                allowsGoneWidget: getAttr('barrierAllowsGoneWidgets'),
                margin: getAttr('barrierMargin')
            };
        }

        // Flow
        if (data.flags.isFlow) {
            data.attributes.flow = {
                referencedIds: getAttr('constraint_referenced_ids'),
                wrapMode: getAttr('flow_wrapMode'),
                maxElementsWrap: getAttr('flow_maxElementsWrap'),
                horizontalStyle: getAttr('flow_horizontalStyle'),
                verticalStyle: getAttr('flow_verticalStyle'),
                horizontalGap: getAttr('flow_horizontalGap'),
                verticalGap: getAttr('flow_verticalGap'),
                horizontalBias: getAttr('flow_horizontalBias'),
                verticalBias: getAttr('flow_verticalBias'),
                firstHorizontalStyle: getAttr('flow_firstHorizontalStyle'),
                lastHorizontalStyle: getAttr('flow_lastHorizontalStyle'),
                horizontalAlign: getAttr('flow_horizontalAlign'),
                verticalAlign: getAttr('flow_verticalAlign')
            };
        }

        // LinearLayout
        if (viewType === 'LinearLayout') {
            data.attributes.linear = {
                orientation: getAttr('orientation') || 'vertical',
                weightSum: getAttr('weightSum'),
                gravity: getAttr('gravity'),
                baselineAligned: getAttr('baselineAligned'),
                measureWithLargestChild: getAttr('measureWithLargestChild'),
                divider: getAttr('divider'),
                showDividers: getAttr('showDividers'),
                dividerPadding: getAttr('dividerPadding')
            };
        }
        
        // ScrollView
        if (viewType.includes('ScrollView')) {
            data.attributes.scroll = {
                fillViewport: getAttr('fillViewport'),
                scrollbars: getAttr('scrollbars'),
                fadeScrollbars: getAttr('fadeScrollbars'),
                scrollbarStyle: getAttr('scrollbarStyle'),
                overScrollMode: getAttr('overScrollMode')
            };
        }
        
        // ProgressBar / SeekBar
        if (viewType.includes('Progress') || viewType.includes('SeekBar')) {
            data.attributes.progress = {
                progress: getAttr('progress'),
                max: getAttr('max'),
                min: getAttr('min'),
                indeterminate: getAttr('indeterminate'),
                progressTint: getAttr('progressTint'),
                progressBackgroundTint: getAttr('progressBackgroundTint'),
                secondaryProgress: getAttr('secondaryProgress'),
                secondaryProgressTint: getAttr('secondaryProgressTint')
            };
        }

        //  CardView
        if (viewType.includes('Card')) {
            data.attributes.card = {
                cardCornerRadius: getAttr('cardCornerRadius'),
                cardElevation: getAttr('cardElevation'),
                cardBackgroundColor: getAttr('cardBackgroundColor'),
                contentPadding: getAttr('contentPadding'),
                contentPaddingLeft: getAttr('contentPaddingLeft'),
                contentPaddingTop: getAttr('contentPaddingTop'),
                contentPaddingRight: getAttr('contentPaddingRight'),
                contentPaddingBottom: getAttr('contentPaddingBottom'),
                cardMaxElevation: getAttr('cardMaxElevation'),
                cardPreventCornerOverlap: getAttr('cardPreventCornerOverlap'),
                cardUseCompatPadding: getAttr('cardUseCompatPadding')
            };
        }

        // CheckBox / RadioButton / Switch
        if (viewType.includes('Check') || viewType.includes('Radio') || viewType.includes('Switch')) {
            data.attributes.checkable = {
                checked: getAttr('checked'),
                button: getAttr('button'),
                buttonTint: getAttr('buttonTint'),
                buttonTintMode: getAttr('buttonTintMode')
            };
        }

        // RecyclerView
        if (viewType.includes('RecyclerView')) {
            data.attributes.recycler = {
                layoutManager: getAttr('layoutManager'),
                orientation: getAttr('orientation'),
                spanCount: getAttr('spanCount'),
                reverseLayout: getAttr('reverseLayout'),
                stackFromEnd: getAttr('stackFromEnd')
            };
        }
    }
}