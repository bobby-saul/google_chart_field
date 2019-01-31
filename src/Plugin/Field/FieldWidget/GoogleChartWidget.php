<?php

namespace Drupal\google_chart_field\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'google_chart_widget' widget.
 *
 * @FieldWidget(
 *   id = "google_chart_widget",
 *   label = @Translation("Google chart widget"),
 *   field_types = {
 *     "google_chart_field_type"
 *   }
 * )
 */
class GoogleChartWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $elements = [];

    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];

    $summary[] = t('Google Chart display');
    if (!empty($this->getSetting('placeholder'))) {
      $summary[] = t('Placeholder: @placeholder', ['@placeholder' => $this->getSetting('placeholder')]);
    }

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $field_name = $this->fieldDefinition->getLabel();
    $element['#attached']['library'][] = 'google_chart_field/widget';

    $element['#prefix'] = '<strong>' . $field_name .'</strong><div class="google-chart-field-wrapper">';
    $element['#suffix'] = '</div>';

    $element['data'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Data'),
      '#default_value' => isset($items[$delta]->data) ?
      $items[$delta]->data : NULL,
      '#prefix' => '<div class="handsontable-wrapper"></div><div class="google-chart-data-field-wrapper">',
      '#suffix' => '</div>',
    ];

    $element['options'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Options'),
      '#default_value' => isset($items[$delta]->options) ?
      $items[$delta]->options : NULL,
      '#prefix' => '<div class="googlecharts-wrapper"></div><div class="google-chart-options-field-wrapper">',
      '#suffix' => '</div>',
    ];

    return $element;
  }

}
