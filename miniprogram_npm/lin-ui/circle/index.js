Component({
  externalClasses: ["l-value-class"],
  properties: {
    percent: {
      type: Number,
      value: 0
    },
    outerDiameter: {
      type: Number,
      value: 220
    },
    innerDiameter: {
      type: Number,
      value: 170
    },
    activeColor: {
      type: String
    },
    backgroundColor: {
      type: String,
      value: "#EBEBEB"
    },
    innerColor: {
      type: String,
      value: "#FFFFFF"
    },
    active: {
      type: Boolean,
      value: !1
    },
    duration: {
      type: Number,
      value: 30
    },
    showValue: {
      type: Boolean,
      value: !1
    },
    valueColor: {
      type: String
    },
    valueSize: {
      type: Number,
      value: 25
    }
  },
  options: {
    multipleSlots: !0,
    pureDataPattern: /^_/
  },
  data: {
    displayPercent: 0
  },
  observers: {
    percent: async function (e) {
      if (e > 100) this.setData({
        percent: 100
      });
      else if (e < 0) this.setData({
        percent: 0
      });
      else if (this.data.active) {
        let t = this.data.displayPercent;
        if (t < e)
          for (; t < e;) await this.sleep(this.data.duration), t += 1, this.setData({
            displayPercent: t
          });
        else if (t > e)
          for (; t > e;) await this.sleep(this.data.duration), t -= 1, this.setData({
            displayPercent: t
          })
      } else this.setData({
        displayPercent: e
      })
    },
    outerDiameter: function (e) {
      e < this.data.innerDiameter && (e = this.data.innerDiameter, this.setData({
        outerDiameter: e
      }))
    },
    innerDiameter: function (e) {
      e < 0 && this.setData({
        innerDiameter: 0
      })
    }
  },
  methods: {
    sleep: e => new Promise(t => {
      setTimeout(t, e)
    })
  }
});