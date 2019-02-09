<?php

namespace Drupal\google_chart_field\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Plugin implementation of the 'google_chart_field_type' field type.
 *
 * @FieldType(
 *   id = "google_chart_field_type",
 *   label = @Translation("Google chart field type"),
 *   description = @Translation("A field type for creating charts"),
 *   default_widget = "google_chart_widget",
 *   default_formatter = "google_chart_formatter"
 * )
 */
class GoogleChartFieldType extends FieldItemBase {

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    $properties['data'] = DataDefinition::create('string')
      ->setLabel(t('The data from handsontable.'));
    $properties['chart_wrapper'] = DataDefinition::create('string')
      ->setLabel(t('The chart wrapper object that goes with the chart display.'));

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    return [
      'columns' => [
        'data' => [
          'type' => 'text',
          'size' => 'big',
          'not null' => FALSE,
        ],
        'chart_wrapper' => [
          'type' => 'text',
          'size' => 'big',
          'not null' => FALSE,
        ],
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function isEmpty() {
    $isEmpty = TRUE;
    $data = $this->get('data')->getString();

    if (!empty($data)){
      $dataObj = json_decode($data);
      if (!empty($dataObj)){
        $isEmpty = FALSE;
      }
    }

    return $isEmpty;
  }

}
