<?php declare(strict_types=1);

namespace Shopware\Mail\Struct;

use Shopware\Api\Entity\Search\SearchResultInterface;
use Shopware\Api\Entity\Search\SearchResultTrait;
use Shopware\Mail\Collection\MailTranslationBasicCollection;

class MailTranslationSearchResult extends MailTranslationBasicCollection implements SearchResultInterface
{
    use SearchResultTrait;
}
