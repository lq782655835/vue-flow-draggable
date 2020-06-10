import { CONNECTORSEPARATESYMBOL } from './const';

export default function flowExec({ instance }) {
  /**
   * @description 模拟延时效果
   * @param {function} fn
   * @param {number} time
   * @returns
   */
  function timeout(fn, time) {
    return new Promise((res) => {
      setTimeout(() => {
        fn();
        res(true);
      }, time);
    });
  }

  function changeStateByNodeId(nodeId, state) {
    const nodeEl = document.getElementById(nodeId);
    nodeEl.vNode.$children[0].state = state;
  }

  function getConnectorByUuids(uuids) {
    const edge = uuids.join(CONNECTORSEPARATESYMBOL);
    const connectors = instance.getAllConnections();
    const connector = connectors.find(c => c.getUuids().join(CONNECTORSEPARATESYMBOL) === edge);
    return connector;
  }

  function blingConnectors(edges) {
    const connectors = instance.getAllConnections();
    connectors.forEach((c) => {
      c.canvas.classList.remove('active');
    });

    edges.forEach((edge) => {
      const c = getConnectorByUuids(edge.split(CONNECTORSEPARATESYMBOL));
      c.canvas.classList.add('active');
    });
  }

  this.execModel = () => {
    changeStateByNodeId('aaa', 'loading');
    return timeout(() => {
      changeStateByNodeId('aaa', 'success');
      changeStateByNodeId('bbb', 'loading');
      blingConnectors(['source1&&target1', 'source2&&target2']);
    }, 3000)
      .then(() => timeout(() => {
        changeStateByNodeId('bbb', 'success');
        changeStateByNodeId('ccc', 'loading');
        blingConnectors(['source3&&ccc111', 'source3&&ccc222']);
      }, 4000))
      .then(() => timeout(() => {
        changeStateByNodeId('ccc', 'success');
        changeStateByNodeId('ddd', 'failed');
        blingConnectors([]);
      }, 5000));
  };
}
