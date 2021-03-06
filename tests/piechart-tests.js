'use strict';

var expect = require('chai').expect;  
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var ReactDOM = require('react-dom');
var PieChart = require('../src/piechart').PieChart;
var generatePartsOfWhole = require('./utils/datagen').generatePartsOfWhole;

describe('PieChart', function() {

  var data = generatePartsOfWhole();
  var values = data.map( (item) => item.value );

  it('renders piechart', function() {
    // Render a piechart using array data
    var piechart = TestUtils.renderIntoDocument(
      <PieChart data={data} width={400} height={200} />
    );

    // Verify that it has the same number of pies as the array's length
    var pie = TestUtils.findRenderedDOMComponentWithClass(
      piechart, 'rd3-piechart');
    expect(pie).to.exist;
    expect(pie.tagName).to.equal('g');

    var pieGroup = TestUtils.findRenderedDOMComponentWithClass(piechart, 'rd3-piechart-pie');
    expect(pieGroup).to.exist;

    var chartSeries = TestUtils.scryRenderedDOMComponentsWithClass(piechart, 'rd3-piechart-arc');
    expect(chartSeries.length).to.equal(values.length);

  });

  it('format value text from valueTextFormatter prop', function() {

    // prefix our value text with $ sign by valueTextFormatter prop
    var piechart = TestUtils.renderIntoDocument(
      <PieChart 
        data={data} width={400} height={200} 
        valueTextFormatter={val=>'$'+val} 
      />
    );
    
    var formattedValueTexts = TestUtils.scryRenderedDOMComponentsWithClass(piechart, 'rd3-piechart-value');
    expect(formattedValueTexts.length).to.equal(values.length);    
    expect(ReactDOM.findDOMNode(formattedValueTexts[0]).textContent).to.contain('$');
    
  });

  it('doesnt show inner labels if not specified', function() {
    var piechart = TestUtils.renderIntoDocument(
      <PieChart 
        data={data} width={400} height={200} 
        showInnerLabels={false}
      />
    );
    
    var labels = TestUtils.scryRenderedDOMComponentsWithClass(piechart, 'rd3-piechart-value');
    expect(labels.length).to.equal(0);    
  });

  it('doesnt show outer labels if not specified', function() {
    var piechart = TestUtils.renderIntoDocument(
      <PieChart 
        data={data} width={400} height={200} 
        showOuterLabels={false}
      />
    );
    
    var labels = TestUtils.scryRenderedDOMComponentsWithClass(piechart, 'rd3-piechart-label');
    expect(labels.length).to.equal(0);    
  });

  it('animates pie correctly', function() {

     var piechart = TestUtils.renderIntoDocument(
      <PieChart data={data} width={400} height={200} />
    );

    var pies = TestUtils.scryRenderedDOMComponentsWithTag(
      piechart, 'path');

    var pie = pies[0];
    var defaultFill = pie.getAttribute('fill');

    // Animation starts with hover
    TestUtils.Simulate.mouseOver(pie);
    expect(pie.getAttribute('fill')).to.not.equal(defaultFill);

    // TestUtils.Simulate.mouseOut(circle) is not working here
    // https://github.com/facebook/react/issues/1297
    // Animation ends with end of hover
    TestUtils.SimulateNative.mouseOut(pie);
    expect(pie.getAttribute('fill')).to.equal(defaultFill);


  });
});
